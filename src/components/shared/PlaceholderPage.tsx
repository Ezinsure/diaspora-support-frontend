const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => {
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-[-0.01em]">{title}</h1>
            <p className="mt-2 text-ink/60">{description ?? "This page is being designed."}</p>
            <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-navy-300/60 text-sm text-ink/50">
                Content goes here
            </div>
        </div>
    );
}
export default PlaceholderPage;