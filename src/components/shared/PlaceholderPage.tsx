const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => {
    return (
        <div className="bg-white min-h-[85vh] rounded-md p-8">
            <h2 className="font-sans text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-ink/60">{description ?? "This page is being designed."}</p>
            <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-navy-300/60 text-sm text-ink/50">
                Content goes here
            </div>
        </div>
    );
}
export default PlaceholderPage