const fetchStats = async () => {
  setLoading(true);
  try {
    const r = await fetchAPI(`/lite/nodes/id/${nodeId}`);
    
    // --- PHẦN CONSOLE.LOG ĐỂ DEBUG ---
    console.group("🔍 Debug Node API");
    console.log("Endpoint:", `/lite/nodes/id/${nodeId}`);
    console.log("Raw Response:", r);
    
    if (r && r.data) {
      console.log("Stats Object:", r.data.stats);
      console.log("Hardware Metrics:", r.data.stats?.lastSuccessfulSync?.details?.metrics);
    }
    console.groupEnd();
    // --------------------------------

    if (isMounted.current) {
      const nodeData = r?.data?.stats || r?.stats || r;
      setStats(nodeData);
    }
  } catch (e) {
    console.error("❌ API Error:", e);
    if (isMounted.current) setStats({ error: true });
  } finally {
    if (isMounted.current) setLoading(false);
  }
};
