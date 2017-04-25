//
// var layer = points.layers.get(0);
// console.info(layer.features.get(0).getGeometry());
// var targetFeature = layer.features.get(0).getGeometry().intersection(ds.layers.get(0).features.get(0).getGeometry());
// console.info(targetFeature.toJSON());

function intersect(warnCell, areasOfInterest) {
  var areasOfInterestLayer = areasOfInterest.layers.get(0);

  if (!areasOfInterestLayer) {
    return null;
  }

  var feature = areasOfInterestLayer.features.get(0);

  if (!feature) {
    return null;
  }

  var warnCellLayer = warnCell.layers.get(0);

  if (!warnCellLayer) {
    return null;
  }

  var warnCellFeature = warnCellLayer.features.get(0);

  if (!warnCellFeature) {
    return null;
  }

  var targetFeature = feature.getGeometry().intersection(warnCellFeature.getGeometry());
  return JSON.parse(targetFeature.toJSON());
}

// function extentValidation(getCapabilities, )

module.exports = {
  intersect: intersect
}
