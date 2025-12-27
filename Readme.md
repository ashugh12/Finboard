# Diagram
## 1. Application Architecture

<p align="center" style="margin: 0;">
  <img src="./public/ApplicationArchitecture.svg" width="500" />
</p>


## 2. API Integration using Adapters
<p align="center" style="margin: 0;">
  <img src="./public/API_Architecture.svg" width="500" />
</p>

# Feature
## 1. Widget Management Feature
Widgets are defined using a strongly typed `Widget` model that includes API
configuration, selected fields, and view-specific options. All widget
instances are managed through a centralized Zustand store that supports
creation, removal, layout adjustment, and reconfiguration, allowing widgets
to be persisted and edited independently of the UI.

## 2. Data Persistence
Widget configurations and dashboard layouts are persisted using browser storage via Zustand’s `persist` middleware.
Cached API responses and widget state allow the dashboard to recover fully on page refresh or browser restart.
The application restores widgets, layout, and polling state automatically after reload.
Dashboard configurations can be exported and imported using service-layer utilities that interact with the layout store.
Import/export functionality enables configuration backup and portability across sessions.