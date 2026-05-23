import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser, getHistory, deleteHistory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [query, setQuery] = useState("");
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await getCurrentUser();
      } catch (err) {
        navigate('/assistant/account?tab=login');
        return;
      } finally {
        if (mounted) setUserChecked(true);
      }

      await load();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const load = async (reset = true) => {
    setLoading(true);
    try {
      const res = await getHistory(reset ? 0 : skip, limit, query || undefined);
      if (res && res.items) {
        setItems(reset ? res.items : [...items, ...res.items]);
        setTotal(res.total || 0);
        setSkip((prev) => (reset ? res.items.length : prev + res.items.length));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this history item?')) return;
    try {
      await deleteHistory(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cropsense-history-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl font-bold">Crop Analysis History</h1>
            <div className="flex items-center gap-2">
              <input placeholder="Filter by disease" value={query} onChange={(e) => setQuery(e.target.value)} className="px-3 py-2 border border-border rounded bg-card text-sm" />
              <Button onClick={() => load(true)}>Search</Button>
              <Button variant="outline" onClick={exportJson}><Download className="w-4 h-4" /> Export</Button>
            </div>
          </div>

          {!userChecked ? null : (
            <div>
              {loading && <div className="text-sm text-muted-foreground">Loading...</div>}

              {!loading && items.length === 0 && (
                <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">No history yet. Your saved scans will appear here.</div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {items.map((it) => (
                  <div key={it.id} className="bg-background border border-border rounded-xl p-4 flex gap-4">
                    <img src={it.imageBase64 || it.image || ''} alt="scan" className="w-28 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{it.disease || it.disease_name}</h3>
                        <div className="text-sm text-muted-foreground">{new Date(it.timestamp || it.date || it.createdAt || it._id?.getTimestamp?.() || Date.now()).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Confidence: <strong className="text-foreground">{it.confidence}</strong></div>
                      <div className="text-sm text-muted-foreground">Severity: <strong className="text-foreground">{it.severity}</strong></div>
                      <div className="mt-2 text-sm text-muted-foreground">Treatment: {Array.isArray(it.remedies?.organic) ? it.remedies.organic.join(', ') : (it.remedies?.chemical || '—')}</div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(it.id)} className="text-destructive gap-1"><Trash2 className="w-4 h-4" /> Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length < total && (
                <div className="mt-6 text-center">
                  <Button onClick={() => load(false)}>Load more</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HistoryPage;
