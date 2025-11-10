export default function Pricing() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <h1 className="text-5xl font-normal text-center mb-6">Simple, lazy pricing</h1>
            <p className="text-[#999] text-center mb-16">Free forever. Plus for power.</p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Free */}
                <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
                    <h3 className="text-2xl mb-2">Free</h3>
                    <p className="text-[#999] mb-6">For quick drops</p>
                    <ul className="space-y-3 text-sm">
                        <li>100MB per file</li>
                        <li>10 min sessions</li>
                        <li>No signup</li>
                    </ul>
                    <button className="mt-8 w-full py-3 bg-white text-black rounded-lg">Current Plan</button>
                </div>

                {/* Plus */}
                <div className="bg-gradient-to-br from-[#00ff88]/5 to-transparent border border-[#00ff88]/50 rounded-2xl p-8 relative">
                    <div className="absolute top-0 right-0 bg-[#00ff88] text-black text-xs px-3 py-1 rounded-bl-lg">POPULAR</div>
                    <h3 className="text-2xl mb-2">Plus</h3>
                    <p className="text-[#999] mb-6">$4.99/month or $49/year</p>
                    <ul className="space-y-3 text-sm">
                        <li>2GB per file</li>
                        <li>2 hour sessions</li>
                        <li>File history (7 days)</li>
                        <li>Folder upload</li>
                        <li>Password rooms</li>
                    </ul>
                    <button className="mt-8 w-full py-3 bg-[#00ff88] text-black rounded-lg">Upgrade Now</button>
                </div>
            </div>
        </div>
    );
}