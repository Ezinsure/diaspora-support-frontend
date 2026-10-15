import SettingsTabs from "./SettingTabs";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="rounded-3xl border border-white/80 bg-white/70 shadow-[0_20px_50px_-35px_rgba(11,42,99,0.35)] backdrop-blur">
            <SettingsTabs />
            <div className="p-4 ">{children}</div>
        </div>
    );
}
export default SettingsLayout