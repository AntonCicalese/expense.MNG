/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3958537269")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number3084850148",
    "max": null,
    "min": null,
    "name": "balance",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3958537269")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number3084850148",
    "max": null,
    "min": null,
    "name": "money",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
