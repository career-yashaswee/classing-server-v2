import Settings from "../schemas/settingSchema/settingSchema.js";

// Create or Update User Settings
const saveSettings = async (req, res) => {
  try {
    const { userID, isDark, isRTL, isNotificationEnabled } = req.body;

    let settings = await Settings.findOne({ userID });

    if (settings) {
      // Update existing settings
      settings.isDark = isDark ?? settings.isDark;
      settings.isRTL = isRTL ?? settings.isRTL;
      settings.isNotificationEnabled = isNotificationEnabled ?? settings.isNotificationEnabled;
      await settings.save();
      return res.status(200).json({ message: "Settings updated successfully", settings });
    }

    // Create new settings
    settings = new Settings({
      userID,
      isDark,
      isRTL,
      isNotificationEnabled,
    });

    await settings.save();
    res.status(201).json({ message: "Settings created successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get User Settings
const getSettings = async (req, res) => {
  try {
    const { userID } = req.params;
    const settings = await Settings.findOne({ userID });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete User Settings
const deleteSettings = async (req, res) => {
  try {
    const { userID } = req.params;
    const settings = await Settings.findOneAndDelete({ userID });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json({ message: "Settings deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { saveSettings, getSettings, deleteSettings };
