import csv
from google.cloud import firestore

db = firestore.Client(project="habits-21cf4")
habits_col_ref = db.collection(u'habits')

csv_filename = 'Checkmarks.csv'


def create_habits():
    habits = {}
    measures = []
    with open(csv_filename) as csv_file:
        reader = csv.DictReader(csv_file)
        for idx, row in enumerate(reader):
            if idx == 0:
                habit_names = set(row.keys()) - {"Date"}
                for name in habit_names:
                    habits[name] = {
                        "description": name,
                        "measureType": {
                            "kind": "binary",  # assume binary by default
                        },
                    }
            date = row["Date"]
            for name in habit_names:
                value = int(row[name])
                # Quanti ?
                if value > 2:
                    habits[name]["measureType"]["kind"] = "quanti"

    for habit in habits.values():
        doc_ref = habits_col_ref.document()
        doc_ref.set(habit)


def create_measures():
    habits = {}
    for doc in habits_col_ref.stream():
        habits[doc.id] = doc.to_dict()
    name_to_id = {habit["description"]: _id for (_id, habit) in habits.items()}

    measures = []
    with open(csv_filename) as csv_file:
        reader = csv.DictReader(csv_file)
        for idx, row in enumerate(reader):
            if idx == 0:
                habit_names = set(row.keys()) - {"Date"}
            date = row["Date"]
            for name in habit_names:
                value = int(row[name])
                # -1 means unknown, 1 means unknown but passing based on target def
                if value in {-1, 1}:
                    continue

                _id = name_to_id[name]
                habit = habits[_id]
                doc_ref = habits_col_ref.document(_id).collection("measures").document(date)

                if habit["measureType"]["kind"] == "quanti":
                    value = float(value) / 100
                else:
                    # 2 means "passed"
                    value = 1 if value == 2 else 0

                doc_ref.set({
                    "day": date,
                    "value": value,
                })


if __name__ == '__main__':
    create_habits()
    create_measures()