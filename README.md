This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-apconst [numVariants, setNumVariants] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showVariantGen, setShowVariantGen] = useState(false);
  const [variantCount, setVariantCount] = useState(2);
  const [variantLoading, setVariantLoading] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

  const [saved, setSaved] = useState<SavedSim[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [search, setSearch] = useState("");

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCompanyId, setInviteCompanyId] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement | null>(null);

  // ------- Load saved simulations -------
  useEffect(() => {
    try {
      const local = getSimulations() ?? [];
      setSaved(Array.isArray(local) ? local : []);
    } catch {
      setSaved([]);
    }

    async function loadRemote() {
      if (!supabase) return;
      try {
        const tables = ["campaigns", "simulations"];
        let remoteData: any[] | null = null;
        for (const table of tables) {
          const { data, error } = await supabase!
            .from(table)
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(200);
  