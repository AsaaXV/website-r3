export interface QuizQuestion {
  id: string;
  itemTitle: string;
  itemImage: string;
  itemDescription: string;
  hint: string;
  options: {
    label: string;
    binColor: string; // e.g. '#eab308'
    binName: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  practicalTip: string;
}

export interface EcoMyth {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  category: string;
  impactLevel: 'Tinggi' | 'Sedang' | 'Kritis';
}

export interface DegradationItem {
  id: string;
  name: string;
  category: 'Organik' | 'Kertas' | 'Plastik' | 'Logam & Kaca' | 'B3 & Residu';
  durationText: string;
  durationSortOrder: number; // in days for sorting
  color: string;
  description: string;
  alternativeSolution: string;
}

export interface GlossaryItem {
  term: string;
  category: string;
  definition: string;
  campusExample: string;
}

export const SORTING_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    itemTitle: 'Gelas Plastik Minuman Boba / Kopi Dingin',
    itemImage: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Gelas plastik bening dengan sisa es batu, susu manis, dan sedotan plastik.',
    hint: 'Perhatikan kondisi kebersihan cairan dan sedotan di dalamnya.',
    options: [
      {
        label: 'Langsung buang ke Tong Kuning (Plastik) bersama es batunya',
        binColor: '#eab308',
        binName: 'Kuning (Plastik)',
        isCorrect: false,
      },
      {
        label: 'Kosongkan sisa minuman, bilas air singkat, buang cup ke Tong Kuning, sedotan ke Residu',
        binColor: '#16a34a',
        binName: 'Pilah Bersih & Masuk Kuning',
        isCorrect: true,
      },
      {
        label: 'Buang ke Tong Hijau (Organik) karena ada sisa es susu',
        binColor: '#16a34a',
        binName: 'Hijau (Organik)',
        isCorrect: false,
      },
      {
        label: 'Buang ke Tong Biru (Kertas)',
        binColor: '#2563eb',
        binName: 'Biru (Kertas)',
        isCorrect: false,
      },
    ],
    explanation: 'Sisa minuman manis mengandung gula yang mengundang bakteri dan menurunkan mutu biji plastik daur ulang. Gelas PP/PET harus dikosongkan dan dibilas sebelum masuk tong anorganik. Sedotan kecil sering tidak lolos sortir mesin daur ulang sehingga masuk residu.',
    practicalTip: 'Gunakan tumbler reusable saat membeli minuman di kantin kampus untuk menghemat Rp 1.000 - Rp 2.000 dan mencegah timbulan plastik sekali pakai!',
  },
  {
    id: 'q2',
    itemTitle: 'Kotak Kardus Pizza / Makanan Cepat Saji',
    itemImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Kardus cokelat tebal dengan bagian alas yang berminyak dan ada noda keju, tetapi bagian tutupnya masih bersih kering.',
    hint: 'Minyak makanan adalah musuh utama proses daur ulang bubur kertas (pulp).',
    options: [
      {
        label: 'Buang seluruh kotak ke Tong Biru (Kertas & Karton)',
        binColor: '#2563eb',
        binName: 'Biru (Kertas)',
        isCorrect: false,
      },
      {
        label: 'Robek: Bagian bersih ke Tong Biru (Kertas), bagian berminyak ke Tong Kompos / Residu',
        binColor: '#16a34a',
        binName: 'Pemisahan Bagian Bersih & Kotor',
        isCorrect: true,
      },
      {
        label: 'Buang seluruhnya ke Tong Merah (B3)',
        binColor: '#dc2626',
        binName: 'Merah (B3)',
        isCorrect: false,
      },
      {
        label: 'Cuci kardus dengan sabun hingga minyaknya hilang',
        binColor: '#64748b',
        binName: 'Cuci Kardus',
        isCorrect: false,
      },
    ],
    explanation: 'Minyak dan lemak tidak bisa dipisahkan dari serat kertas saat proses penggilingan bubur kertas (pulping), sehingga merusak satu batch daur ulang. Kardus tidak bisa dicuci karena seratnya akan hancur. Bagian tutup yang bersih bernilai ekonomi tinggi untuk disetor ke bank sampah.',
    practicalTip: 'Merobek bagian kardus yang bersih adalah kebiasaan pemilahan sederhana yang berdampak sangat besar bagi pekerja daur ulang kertas!',
  },
  {
    id: 'q3',
    itemTitle: 'Struk Kertas Kasir Minimarket / ATM',
    itemImage: 'https://images.unsplash.com/photo-1554415707-9e49016a3507?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Kertas putih tipis dan licin yang dicetak tanpa tinta melainkan dengan pemanas termal.',
    hint: 'Periksa apakah kertas ini dilapisi zat kimia Bisphenol A (BPA).',
    options: [
      {
        label: 'Tong Biru (Kertas Daur Ulang) karena berbahan dasar kertas',
        binColor: '#2563eb',
        binName: 'Biru (Kertas)',
        isCorrect: false,
      },
      {
        label: 'Tong Residu / Abu-Abu (Tidak Dapat Didaur Ulang)',
        binColor: '#475569',
        binName: 'Abu-Abu (Residu)',
        isCorrect: true,
      },
      {
        label: 'Tong Hijau (Organik) untuk dibuat pupuk kompos',
        binColor: '#16a34a',
        binName: 'Hijau (Organik)',
        isCorrect: false,
      },
      {
        label: 'Tong Kuning (Plastik)',
        binColor: '#eab308',
        binName: 'Kuning (Plastik)',
        isCorrect: false,
      },
    ],
    explanation: 'Struk kasir menggunakan kertas thermal yang dilapisi bahan kimia BPA atau BPS untuk menghasilkan tulisan ketika dipanaskan. Jika dicampur ke daur ulang kertas, bahan kimia ini mencemari produk kertas daur ulang seperti tisu wajah dan kemasan makanan.',
    practicalTip: 'Pilihlah opsi e-receipt / struk digital di aplikasi saat berbelanja di minimarket kampus untuk mencegah limbah kertas thermal.',
  },
  {
    id: 'q4',
    itemTitle: 'Baterai Bekas Jam Dinding / Mouse Komputer',
    itemImage: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Baterai AA/AAA bekas yang sudah habis dayanya.',
    hint: 'Baterai mengandung logam berat seperti merkuri, timbal, dan kadmium.',
    options: [
      {
        label: 'Tong Sampah Umum / Residu bersama sampah kos biasa',
        binColor: '#64748b',
        binName: 'Tong Biasa',
        isCorrect: false,
      },
      {
        label: 'Tong Kuning (Plastik)',
        binColor: '#eab308',
        binName: 'Kuning (Plastik)',
        isCorrect: false,
      },
      {
        label: 'Tong Merah / Drop Box Khusus E-Waste B3',
        binColor: '#dc2626',
        binName: 'Merah (B3 & Khusus)',
        isCorrect: true,
      },
      {
        label: 'Tong Hijau (Organik)',
        binColor: '#16a34a',
        binName: 'Hijau (Organik)',
        isCorrect: false,
      },
    ],
    explanation: 'Baterai tergolong Bahan Berbahaya dan Beracun (B3). Jika dibuang ke TPA, casing baterai akan berkarat dan cairan logam berat meresap ke air tanah yang dikonsumsi masyarakat. Letakkan selotip pada kutub positif dan bawa ke drop point e-waste kampus.',
    practicalTip: 'Gunakan baterai isi ulang (rechargeable NiMH) untuk mouse dan periferal kuliah agar tidak terus-menerus memproduksi sampah B3.',
  },
  {
    id: 'q5',
    itemTitle: 'Botol Air Mineral PET Bening (#1)',
    itemImage: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Botol plastik bening dengan tutup biru dan label plastik tipis pembungkus merek.',
    hint: 'Bagaimana cara memaksimalkan nilai daur ulangnya?',
    options: [
      {
        label: 'Lepas label tipis, kosongkan air, remas/injak botol, lalu masukkan ke Tong Kuning',
        binColor: '#eab308',
        binName: 'Kuning (Plastik Terpilah)',
        isCorrect: true,
      },
      {
        label: 'Biarkan isi airnya agar berat saat ditimbang di bank sampah',
        binColor: '#64748b',
        binName: 'Timbang dengan Air',
        isCorrect: false,
      },
      {
        label: 'Bakar botol agar tidak memakan tempat di tempat sampah kos',
        binColor: '#dc2626',
        binName: 'Bakar Sampah',
        isCorrect: false,
      },
      {
        label: 'Buang ke saluran drainase atau got depan kampus',
        binColor: '#475569',
        binName: 'Saluran Air',
        isCorrect: false,
      },
    ],
    explanation: 'Botol PET bening adalah plastik dengan nilai daur ulang tertinggi (dapat dijadikan benang poliester pakaian atau botol baru). Label merek terbuat dari plastik PVC/OPP yang berbeda polimer sehingga harus dilepas. Meremas botol menghemat 75% kapasitas ruang drop box kampus!',
    practicalTip: 'Jangan sekali-kali mengisi air atau batu ke dalam botol untuk menambah timbangan, karena sistem verifikasi otomatis akan menandainya sebagai anomali.',
  },
  {
    id: 'q6',
    itemTitle: 'Sisa Kulit Pisang & Daun Kering di Selasar Kampus',
    itemImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    itemDescription: 'Limbah bahan organik alami yang mudah membusuk.',
    hint: 'Material alami ini kaya akan karbon dan nitrogen untuk tanah.',
    options: [
      {
        label: 'Tong Hijau (Organik) untuk Kompos & Pakan Maggot BSF',
        binColor: '#16a34a',
        binName: 'Hijau (Organik)',
        isCorrect: true,
      },
      {
        label: 'Tong Kuning (Plastik)',
        binColor: '#eab308',
        binName: 'Kuning (Plastik)',
        isCorrect: false,
      },
      {
        label: 'Bungkus dengan plastik kresek hitam lalu ikat mati',
        binColor: '#475569',
        binName: 'Bungkus Plastik Rapat',
        isCorrect: false,
      },
      {
        label: 'Tong Biru (Kertas)',
        binColor: '#2563eb',
        binName: 'Biru (Kertas)',
        isCorrect: false,
      },
    ],
    explanation: 'Material organik jika dipisahkan dengan baik akan diolah di unit biokonversi TPS3R menjadi pupuk kompos atau pakan larva maggot BSF (Black Soldier Fly) yang kaya protein. Jika dibungkus plastik rapat, prosesnya menjadi anaerobik dan menimbulkan bau busuk gas metana.',
    practicalTip: 'Di lingkungan kos, pisahkan sisa buah dan sayur dalam wadah berventilasi atau setorkan ke rumah kompos fakultas.',
  },
];

export const ECO_MYTHS: EcoMyth[] = [
  {
    id: 'm1',
    myth: 'Semua kemasan berbahan kertas pasti ramah lingkungan dan bisa langsung didaur ulang.',
    fact: 'Kemasan kertas seperti paper cup kopi atau mangkuk mie instan dilapisi film plastik polietilen tipis (laminasi) agar tahan bocor, sehingga tidak bisa didaur ulang pada pabrik kertas standar.',
    explanation: 'Laminasi plastik tipis tersebut sulit dipisahkan dari serat kertas di fasilitas pengolahan lokal. Sebagian besar paper cup berujung di TPA kecuali diproses di pabrik khusus pemisah laminasi.',
    category: 'Material Kertas',
    impactLevel: 'Tinggi',
  },
  {
    id: 'm2',
    myth: 'Plastik berlabel oxo-biodegradable aman dibuang sembarangan karena akan larut alami seperti daun.',
    fact: 'Plastik oxo-biodegradable hanya hancur berkeping-keping menjadi serpihan mikroplastik mikroskopis yang justru lebih berbahaya bagi tanah dan rantai makanan.',
    explanation: 'Plastik ini mengandung zat aditif logam yang mempercepat fragmentasi akibat panas dan sinar matahari, namun polimernya tetap tidak dimakan oleh bakteri tanah secara alami. Mikroplastik ini mencemari air dan plankton.',
    category: 'Material Plastik',
    impactLevel: 'Kritis',
  },
  {
    id: 'm3',
    myth: 'Membakar sampah daun dan plastik di halaman kos adalah cara praktis menjaga kebersihan lingkungan.',
    fact: 'Pembakaran terbuka suhu rendah melepaskan gas dioksin, furan, karbon monoksida, dan partikel PM2.5 yang memicu kanker paru, asma, dan merusak lapisan ozon.',
    explanation: 'Satu kilogram plastik yang dibakar melepaskan racun karsinogenik puluhan kali lipat lebih pekat daripada asap knalpot. Daun kering sebaiknya dikubur sebagai mulsa organik atau dimasukkan ke komposter.',
    category: 'Polusi Udara',
    impactLevel: 'Kritis',
  },
  {
    id: 'm4',
    myth: 'Sampah organik sisa makanan di TPA tidak masalah karena akan membusuk sendiri menjadi pupuk.',
    fact: 'Tertimbun di bawah tumpukan sampah plastik di TPA tanpa oksigen (kondisi anaerobik) membuat sampah organik membusuk dan menghasilkan gas metana (CH4) yang 28x lebih kuat memicu pemanasan global dibanding CO2.',
    explanation: 'Selain memicu efek rumah kaca, akumulasi gas metana di TPA bertekanan tinggi juga memicu ledakan TPA fatal seperti tragedi Leuwigajah tahun 2005. Mengomposkan sampah secara aerobik mencegah pembentukan metana berbahaya.',
    category: 'Emisi Metana',
    impactLevel: 'Kritis',
  },
  {
    id: 'm5',
    myth: 'Simbol segitiga panah berputar di bawah wadah plastik selalu berarti barang itu pasti bisa didaur ulang di kota kita.',
    fact: 'Simbol Resin Identification Code (angka 1 sampai 7) hanya menunjukkan jenis molekul plastik, bukan jaminan adanya fasilitas daur ulang lokal yang mau menerimanya.',
    explanation: 'Hanya plastik jenis #1 (PET bening) dan #2 (HDPE tebal) yang memiliki pasar daur ulang mapan di Indonesia. Plastik nomor #3 (PVC), #6 (Styrofoam PS), dan #7 (Other) hampir selalu ditolak bank sampah karena tidak ekonomis.',
    category: 'Taksonomi Daur Ulang',
    impactLevel: 'Sedang',
  },
  {
    id: 'm6',
    myth: 'Mendaur ulang sampah adalah solusi terpenting untuk menghentikan krisis iklim global.',
    fact: 'Daur ulang (Recycle) adalah benteng terakhir dalam hierarki 5R. Jauh lebih penting adalah Menolak (Refuse) dan Mengurangi (Reduce) pembelian barang sekali pakai sejak awal.',
    explanation: 'Proses daur ulang sendiri tetap membutuhkan energi, air pencuci, dan transportasi bahan bakar fosil. Prinsip terbaik adalah tidak menciptakan sampah (Zero Waste) dengan membawa wadah makan dan botol minum sendiri.',
    category: 'Prinsip Zero Waste',
    impactLevel: 'Tinggi',
  },
];

export const DEGRADATION_TIMELINE: DegradationItem[] = [
  {
    id: 'deg_organik',
    name: 'Kulit Jeruk & Sisa Buah Sayur',
    category: 'Organik',
    durationText: '2 - 5 Minggu',
    durationSortOrder: 25,
    color: '#16a34a',
    description: 'Dapat terurai secara alami oleh bakteri tanah dan cacing dalam hitungan minggu.',
    alternativeSolution: 'Gunakan sebagai bahan biokonversi maggot BSF atau pupuk kompos aerobik.',
  },
  {
    id: 'deg_kardus',
    name: 'Kardus Karton Cokelat & Kertas',
    category: 'Kertas',
    durationText: '1 - 2 Bulan',
    durationSortOrder: 45,
    color: '#2563eb',
    description: 'Terbuat dari serat selulosa kayu pohon murni, mudah melunak jika terkena kelembaban.',
    alternativeSolution: 'Setorkan dalam kondisi kering ke Bank Sampah untuk diproses jadi karton daur ulang.',
  },
  {
    id: 'deg_rokok',
    name: 'Puntung Rokok',
    category: 'B3 & Residu',
    durationText: '1 - 5 Tahun',
    durationSortOrder: 1000,
    color: '#b91c1c',
    description: 'Filter rokok BUKAN kapas alami, melainkan serat plastik selulosa asetat beracun yang mengikat nikotin dan arsenik.',
    alternativeSolution: 'Kumpulkan dalam wadah kedap khusus residu racun, jangan buang ke tanah kampus.',
  },
  {
    id: 'deg_kresek',
    name: 'Kantong Plastik Kresek (LDPE)',
    category: 'Plastik',
    durationText: '10 - 20 Tahun',
    durationSortOrder: 5500,
    color: '#d97706',
    description: 'Sangat tipis dan mudah tertiup angin, menyumbat saluran drainase kampus dan menjebak satwa air.',
    alternativeSolution: 'Selalu bawa totebag kain lipat di dalam tas ransel kuliah.',
  },
  {
    id: 'deg_kaleng',
    name: 'Kaleng Minuman Aluminium',
    category: 'Logam & Kaca',
    durationText: '50 - 100 Tahun',
    durationSortOrder: 27000,
    color: '#0284c7',
    description: 'Logam aluminium tahan karat, namun memiliki nilai ekonomi daur ulang 100% tanpa penurunan mutu (infinite recycling).',
    alternativeSolution: 'Bersihkan dan setorkan ke Bank Sampah kampus, bernilai poin tertinggi per kilogram!',
  },
  {
    id: 'deg_sedotan',
    name: 'Sedotan & Tutup Cup Kopi Plastik (PP)',
    category: 'Plastik',
    durationText: '200 - 300 Tahun',
    durationSortOrder: 90000,
    color: '#ea580c',
    description: 'Hanya digunakan rata-rata 15 menit saat minum, namun bertahan berabad-abad mencemari laut.',
    alternativeSolution: 'Tolak sedotan plastik saat memesan minuman (drink straight from cup) atau bawa sedotan stainless steel.',
  },
  {
    id: 'deg_botol',
    name: 'Botol Minum Plastik Sekali Pakai (PET)',
    category: 'Plastik',
    durationText: '450 Tahun',
    durationSortOrder: 164000,
    color: '#e11d48',
    description: 'Dibutuhkan lebih dari 4 generasi manusia sebelum molekul polimer PET pecah seluruhnya menjadi mikroplastik.',
    alternativeSolution: 'Gunakan tumbler pribadi dan manfaatkan dispenser air minum isi ulang gratis di fakultas.',
  },
  {
    id: 'deg_styrofoam',
    name: 'Styrofoam / Wadah Busa (Polistirena)',
    category: 'B3 & Residu',
    durationText: '500+ Tahun / Tidak Terurai Alami',
    durationSortOrder: 999999,
    color: '#475569',
    description: 'Struktur molekulnya sangat stabil dan tidak dapat dicerna oleh mikroorganisme apapun di alam terbuka.',
    alternativeSolution: 'Larangan penggunaan wadah styrofoam di kantin kampus; bawa kotak makan (lunchbox) sendiri.',
  },
];

export const ECO_GLOSSARY: GlossaryItem[] = [
  {
    term: '3R (Reduce, Reuse, Recycle)',
    category: 'Konsep Dasar',
    definition: 'Hierarki pengelolaan sampah: membatasi timbulan sejak awal (Reduce), memanfaatkan kembali benda tanpa olah pabrik (Reuse), dan mendaur ulang menjadi bahan baku baru (Recycle).',
    campusExample: 'Membawa tumbler (Reduce), memakai ulang tas belanja belanja kos (Reuse), dan menyetor botol PET ke Bank Sampah (Recycle).',
  },
  {
    term: '5R / Zero Waste Hierarchy',
    category: 'Konsep Lanjutan',
    definition: 'Pengembangan prinsip 3R yang mencakup Refuse (menolak barang sekali pakai), Reduce, Reuse, Repurpose (mengalihfungsikan), dan Rot (mengomposkan bahan organik).',
    campusExample: 'Menolak kantong kresek di minimarket kampus (Refuse) dan menyetor sisa makanan ke biokonversi maggot (Rot).',
  },
  {
    term: 'Ekonomi Sirkular (Circular Economy)',
    category: 'Prinsip Perekonomian',
    definition: 'Model produksi dan konsumsi yang menjaga nilai material dan produk selama mungkin dengan siklus tertutup, berbeda dengan ekonomi linier (ambil-pakai-buang).',
    campusExample: 'Botol plastik mahasiswa didaur ulang menjadi biji plastik tekstil jas almamater kampus.',
  },
  {
    term: 'Biokonversi Maggot BSF',
    category: 'Teknologi Lingkungan',
    definition: 'Pemanfaatan larva lalat Black Soldier Fly (Hermetia illucens) untuk mengonsumsi sampah organik secara cepat tanpa menimbulkan bau busuk atau menyebarkan penyakit.',
    campusExample: 'Sisa nasi dan sayur kantin Fakultas Pertanian habis diurai 1 ton maggot dalam waktu 24 jam.',
  },
  {
    term: 'Mikroplastik',
    category: 'Isu Dampak',
    definition: 'Partikel plastik berukuran kurang dari 5 milimeter hasil fragmentasi sampah plastik yang mencemari air minum, ikan, dan garam meja.',
    campusExample: 'Serpihan kresek yang hancur di Danau Kampus termakan oleh ikan nila dan mengganggu ekosistem perairan.',
  },
  {
    term: 'Extended Producer Responsibility (EPR)',
    category: 'Kebijakan & Regulasi',
    definition: 'Tanggung jawab produsen barang konsumsi untuk mendanai atau menarik kembali kemasan produknya setelah dikonsumsi masyarakat.',
    campusExample: 'Perusahaan minuman air mineral mendanai drop box penampung botol di selasar kampus.',
  },
  {
    term: 'Upcycling vs Downcycling',
    category: 'Daur Ulang',
    definition: 'Upcycling mengubah barang bekas menjadi produk dengan nilai dan estetika lebih tinggi; Downcycling menurunkan kualitas material (misal kertas putih menjadi kardus buram).',
    campusExample: 'Spanduk baliho wisuda bekas diubah menjadi tas belanja ransel tahan air oleh mahasiswa (Upcycling).',
  },
];
