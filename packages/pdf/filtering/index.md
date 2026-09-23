# Interactive Preview Filtering & Slide-Over Drawer

`jengo/pdf` allows attaching dynamic filter fields to any PDF document or report. In preview mode, these filters render as a slide-over drawer on the right side of the canvas with a backdrop overlay. Modifying any filter in the drawer triggers background AJAX requests (debounced by 300ms) with request cancellation, recomputes the data, updates the underlying HTML, and repaginates the physical preview sheets without reloading the iframe or resetting the user zoom level.

## On This Section

- [Filter Types & Factory](./filter-types)
- [Attaching Filters & the `onFilter` Handler](./on-filter)
- [Schema Report Auto-Filters](./schema-auto-filters)
- [State Synchronization & Direct Downloads](./state-sync)
