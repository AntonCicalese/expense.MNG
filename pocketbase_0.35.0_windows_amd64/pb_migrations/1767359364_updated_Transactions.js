/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2768340402")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Transportation",
      "Food",
      "Entertainment",
      "Other",
      "Subscriptions"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2768340402")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Transportation",
      "Food",
      "Entertainment",
      "Other"
    ]
  }))

  return app.save(collection)
})
