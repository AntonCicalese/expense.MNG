/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2768340402")

  // add field
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
      "Entertainment"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2768340402")

  // remove field
  collection.fields.removeById("select105650625")

  return app.save(collection)
})
