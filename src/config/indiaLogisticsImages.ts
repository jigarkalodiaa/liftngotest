/**
 * Unsplash — **cargo / logistics only** (no passenger autos, cab visuals, or “ride” framing).
 * Passenger-looking assets were removed; legacy export names below alias to cargo-safe URLs.
 * @see https://unsplash.com/license
 */

function indiaPhoto(id: string, w: number, q = 85): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;
}

/** Loaded commercial truck — goods transport (Bengaluru). */
export const indiaPhotoBangaloreLoadedTruck = (w: number) =>
  indiaPhoto('photo-1717616171263-de4808015831', w);

/** Workers loading a commercial vehicle — dock / street goods handoff (Mumbai). */
export const indiaPhotoMumbaiLoading = (w: number) =>
  indiaPhoto('photo-1764116858315-6b149603efe9', w);

/** Warehouse interior — pallets, B2B distribution (no rickshaws). */
export const indiaPhotoWarehouseLogistics = (w: number) =>
  indiaPhoto('photo-1586528116311-ad8dd3c8310d', w);

/** Stacked cartons / freight — hub & sorting. */
export const indiaPhotoFreightBoxes = (w: number) =>
  indiaPhoto('photo-1566576912321-d58ddd7a6088', w);

/** Rear cargo bay — packages staged for route loading. */
export const indiaPhotoCargoBayLoading = (w: number) =>
  indiaPhoto('photo-1605745341112-85968b19335b', w);

/** Delivery operator with carry equipment — last-mile **goods** / meal logistics (not joyride). */
export const indiaPhotoDeliveryRiderGoods = (w: number) =>
  indiaPhoto('photo-1607082348824-0a96f2a4b9da', w);

/** Retail / vendor goods — small-corridor & temple-town adjacent (stalls & product, not metro commute). */
export const indiaPhotoRetailMarketGoods = (w: number) =>
  indiaPhoto('photo-1596462502278-27bfdc403348', w);

/** Intermodal / container context — scalable corporate logistics. */
export const indiaPhotoLogisticsHubScale = (w: number) =>
  indiaPhoto('photo-1494412574643-ff11b0a5c1c3', w);

/** Commercial district — NCR “HQ / infrastructure” mood (use with copy that stays B2B logistics). */
export const indiaPhotoCorporateCityscape = (w: number) =>
  indiaPhoto('photo-1486406146926-c627a92ad1ab', w);

/** Food table — promotions / restaurant partner context only. */
export const indiaPhotoFoodTable = (w: number) =>
  indiaPhoto('photo-1563379926898-05f4575a45d8', w);

/* ─── Legacy names (same functions) — old imports still resolve to cargo-safe imagery ─── */

/** @alias {@link indiaPhotoRetailMarketGoods} */
export const indiaPhotoMumbaiStreetWalk = indiaPhotoRetailMarketGoods;

/** @alias {@link indiaPhotoDeliveryRiderGoods} */
export const indiaPhotoHosurMotorcycle = indiaPhotoDeliveryRiderGoods;

/** @alias {@link indiaPhotoWarehouseLogistics} */
export const indiaPhotoBangaloreAutos = indiaPhotoWarehouseLogistics;

/** @alias {@link indiaPhotoCargoBayLoading} */
export const indiaPhotoHyderabadAuto = indiaPhotoCargoBayLoading;
