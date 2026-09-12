import React, { useState } from 'react';
import { Truck, X, CheckCircle2, MapPin, Calendar, Phone, AlertCircle, Clock } from 'lucide-react';
import { UserProfile, WasteCategoryType, PickupRequest } from '../types';

interface PickupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitRequest: (req: PickupRequest) => void;
}

export const PickupRequestModal: React.FC<PickupRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitRequest,
}) => {
  const [exactAddress, setExactAddress] = useState<string>('Lobi Utama Gedung Dekanat FT Unhas, Tamalanrea');
  const [wasteTypes, setWasteTypes] = useState<WasteCategoryType[]>(['kertas', 'plastik']);
  const [estimatedWeight, setEstimatedWeight] = useState<number>(8.5);
  const [whatsapp, setWhatsapp] = useState<string>('0812-3456-7890');
  const [preferredTime, setPreferredTime] = useState<string>('Sore (14.00 - 16.00 WITA)');
  const [notes, setNotes] = useState<string>('Kardus paket belanja online dan tumpukan kertas revisi skripsi.');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleWasteType = (type: WasteCategoryType) => {
    if (wasteTypes.includes(type)) {
      if (wasteTypes.length > 1) {
        setWasteTypes(wasteTypes.filter((t) => t !== type));
      }
    } else {
      setWasteTypes([...wasteTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: PickupRequest = {
      id: `PICKUP-${Date.now().toString().slice(-6)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      facultyLocation: currentUser.faculty,
      exactAddress,
      wasteTypes,
      estimatedWeightKg: estimatedWeight,
      contactWhatsapp: whatsapp,
      notes: `${notes} (Waktu: ${preferredTime})`,
      status: 'scheduled',
      createdAt: 'Baru saja',
    };

    onSubmitRequest(newReq);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Panggil Armada Penjemputan Sampah
              </h3>
              <p className="text-xs text-slate-500">
                Layanan jemput armada motor roda tiga ramah lingkungan TPST
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Jadwal Penjemputan Dikonfirmasi!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Armada TPST telah memasukkan titik jemput Anda ke rute optimasi VRP hari ini. Petugas akan menghubungi WhatsApp Anda saat armada tiba.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Caller Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email} • {currentUser.faculty}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Nasabah Aktif
              </span>
            </div>

            {/* Exact Location */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Titik Jemput Spesifik (Gedung / Asrama):</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if ('geolocation' in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setExactAddress(
                            `Lokasi GPS Saya (${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}) - ${currentUser.faculty}`
                          );
                        },
                        () => {
                          setExactAddress(`Gedung Dekanat / Lobi Utama ${currentUser.faculty}`);
                        },
                        { enableHighAccuracy: true, timeout: 5000 }
                      );
                    } else {
                      setExactAddress(`Gedung Dekanat / Lobi Utama ${currentUser.faculty}`);
                    }
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>Gunakan Lokasi Saya</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder="Contoh: Lobi Asrama Ramsis Blok B Lantai 1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
              />
              {/* Quick Preset Location Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Pilih Cepat:</span>
                {[
                  'Lobi Gedung Dekanat FT',
                  'Asrama Ramsis Blok B',
                  'Kantin Pusat & Rektorat',
                  'Lab Dasar FMIPA',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setExactAddress(preset)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Waste Categories Multi-select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Kategori Material:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'plastik', label: 'Plastik (Botol/Gelas)' },
                  { id: 'kertas', label: 'Kertas & Kardus' },
                  { id: 'organik', label: 'Organik (Sisa Makanan)' },
                  { id: 'khusus', label: 'E-Waste / Elektronik' },
                ].map((item) => {
                  const isChecked = wasteTypes.includes(item.id as WasteCategoryType);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleWasteType(item.id as WasteCategoryType)}
                      className={`p-2 rounded-lg border text-left font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated weight & WhatsApp */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Estimasi Bobot Total:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="3.0"
                    max="100.0"
                    required
                    value={estimatedWeight}
                    onChange={(e) => setEstimatedWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white font-mono"
                  />
                  <span className="absolute right-3 top-2 font-bold text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-slate-400">Minimal 3 kg untuk jemput armada</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>No. WhatsApp Aktif:</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Preferred Time Window */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Pilihan Jam Penjemputan:</span>
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
              >
                <option value="Pagi (09.00 - 11.30 WITA)">Pagi (09.00 - 11.30 WITA)</option>
                <option value="Sore (14.00 - 16.00 WITA)">Sore (14.00 - 16.00 WITA)</option>
                <option value="Sabtu Pagi (Khusus Akhir Pekan)">Sabtu Pagi (Khusus Akhir Pekan 08.30 - 11.00 WITA)</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Catatan Khusus Penjemputan:</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-slate-600 font-bold hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Kirim Permintaan Jemput</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
