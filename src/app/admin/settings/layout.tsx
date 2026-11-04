import SettingsTabs from "./SettingTabs";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="rounded-3xl border border-white/80 bg-white">
            <div className="sticky top-0 z-20 rounded-t-3xl bg-white">
                <SettingsTabs />
            </div>
            <div className="p-10 custom-scrollbar min-h-[80vh] max-h-[80vh] overflow-y-auto ">{children}</div>
        </div>
    );
}
export default SettingsLayout