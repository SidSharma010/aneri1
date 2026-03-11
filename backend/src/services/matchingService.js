/**
 * Heuristic matching score for a trip against a delivery request.
 * In production, replace with map-provider polyline + ETA based scoring.
 */
export function scoreTripForRequest(trip, request) {
  let score = 0;

  const pickupDistanceKm = haversineKm(
    trip.origin_lat,
    trip.origin_lng,
    request.pickup_lat,
    request.pickup_lng
  );

  const dropDistanceKm = haversineKm(
    trip.destination_lat,
    trip.destination_lng,
    request.drop_lat,
    request.drop_lng
  );

  // closer endpoints are better
  score += Math.max(0, 40 - pickupDistanceKm);
  score += Math.max(0, 40 - dropDistanceKm);

  // trip must start before pickup deadline
  const canPickupInTime = new Date(trip.departure_time) <= new Date(request.pickup_by);
  if (canPickupInTime) score += 10;

  // weight capacity check
  if (trip.capacity_kg >= request.weight_kg) score += 10;

  return Math.round(score);
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLng = degToRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}
