import { useState } from "react";
import ActiveToggle from "../member/ActiveToggle";
import ConfirmPopup from "@/components/ConfirmPopup";
import Popup from "@/components/ModalPopup";
import { updateProfileEditable, updateTeamEditable } from "@/lib/api/admin";

type Props = {
  settings: {
    profile_edit_enabled: boolean;
    team_edit_enabled: boolean;
  };

  setSetting: React.Dispatch<
    React.SetStateAction<{
      profile_edit_enabled: boolean;
      team_edit_enabled: boolean;
    }>
  >;
};

export default function SectionSystemSetting({ settings, setSetting }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [confirmType, setConfirmType] = useState<"profile" | "team" | null>(
    null,
  );

  const [popupOpen, setPopupOpen] = useState(false);

  const [popupType, setPopupType] = useState("success");

  const [popupMessage, setPopupMessage] = useState("");

  async function handleConfirm() {
    try {
      if (confirmType === "profile") {
        const nextValue = !settings.profile_edit_enabled;

        const res = await updateProfileEditable(nextValue);

        if (res.success) {
          setSetting((prev) => ({
            ...prev,
            profile_edit_enabled: nextValue,
          }));

          if(!nextValue) {
            setSetting((prev) => ({
              ...prev,
              team_edit_enabled: false,
            }));
          }

          setPopupType("success");
          setPopupMessage("Profile setting updated");
        }
      }

      if (confirmType === "team") {
        if (!settings.profile_edit_enabled) {
          setPopupType("error");
          setPopupMessage("Please enable profile editing first.");
          setPopupOpen(true);

          return;
        }

        const nextValue = !settings.team_edit_enabled;

        const res = await updateTeamEditable(nextValue);

        if (res.success) {
          setSetting((prev) => ({
            ...prev,
            team_edit_enabled: nextValue,
          }));

          setPopupType("success");
          setPopupMessage("Team setting updated");
        }
      }

      setPopupOpen(true);

      setTimeout(() => {
        setPopupOpen(false);
      }, 1000);
    } catch {
      setPopupType("error");
      setPopupMessage("Update failed");
      setPopupOpen(true);
    } finally {
      setConfirmOpen(false);
      setConfirmType(null);
    }
  }

  return (
    <section className="mt-4">
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Allow users to edit profile
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 text-sm md:text-base bg-white rounded-xl p-4 border border-pinkAccent flex justify-between items-center">
            <span>Enabled users to edit their Profile</span>
            <ActiveToggle
              active={settings.profile_edit_enabled ? 1 : 0}
              onClick={() => {
                setConfirmType("profile");
                setConfirmOpen(true);
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-6 text-sm md:text-base bg-white rounded-xl p-4 border border-pinkAccent flex justify-between items-center">
            <span>Enabled users to edit their Teams</span>
            <ActiveToggle
              active={settings.team_edit_enabled ? 1 : 0}
              onClick={() => {
                setConfirmType("team");
                setConfirmOpen(true);
              }}
              disabled={!settings.profile_edit_enabled}
            />
          </div>
        </div>
      </div>
      <ConfirmPopup
        open={confirmOpen}
        title={
          confirmType === "profile"
            ? settings.profile_edit_enabled
              ? "Disable profile editing?"
              : "Enable profile editing?"
            : settings.team_edit_enabled
              ? "Disable team editing?"
              : "Enable team editing?"
        }
        confirmText="Confirm"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmType(null);
        }}
        onConfirm={handleConfirm}
      />
      <Popup
        open={popupOpen}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </section>
  );
}
