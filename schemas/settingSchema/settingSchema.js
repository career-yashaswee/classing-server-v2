import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      required: true,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    isRTL: {
      type: Boolean,
      default: false,
    },
    isNotificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;

// JSON Format : 
//
// {
//   "_id": "65c8e2f9a74d3b2c8d1e5f9a",
//   "userID": "65c8d1f9e73a3d1a5c9f1b9i",
//   "isDark": true,
//   "isRTL": false,
//   "isNotificationEnabled": true,
//   "createdAt": "2025-02-22T08:30:00.000Z",
//   "updatedAt": "2025-02-22T08:30:00.000Z"
// }
