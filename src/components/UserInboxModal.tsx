import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Search,
  CheckCheck,
  Phone,
  User,
  ExternalLink,
  Sparkles,
  Clock,
  Circle,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { ChatThread, ChatMessage, UserProfile } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';

interface UserInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  initialThreadId?: string | null;
  onOpenUserProfile?: (userId: string, userName: string) => void;
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onStartNewChat?: (participant: UserProfile, itemContext?: any) => void;
}

export const UserInboxModal: React.FC<UserInboxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialThreadId,
  onOpenUserProfile,
  threads,
  onSendMessage,
  onStartNewChat,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    initialThreadId || (threads.length > 0 ? threads[0].id : '')
  );
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update selected thread if initialThreadId changes
  useEffect(() => {
    if (initialThreadId) {
      setSelectedThreadId(initialThreadId);
    } else if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [initialThreadId, threads]);

  // Scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThreadId, threads, isTyping]);

  if (!isOpen) return null;

  const currentThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const filteredThreads = threads.filter(
    (t) =>
      t.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.itemContext?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !currentThread) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    onSendMessage(currentThread.id, messageText);

    // Simulate realistic peer response after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sampleReplies = [
        `Siap kak! Saya tunggu di ${currentThread.participantFaculty || 'kampus'}. Nanti kabari kalau sudah sampai ya.`,
        `Oke sepakat! Sampah/barangnya sudah saya siapkan. Terima kasih banyak ya! 👍`,
        `Wah boleh banget! Besok jam istirahat kuliah kita ketemu langsung ya kak.`,
        `Halo! Masih ada kok, nanti saya bawa ke lobi kampus saat jam istirahat siang.`,
      ];
      const replyText =
        sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
      onSendMessage(currentThread.id, replyText);
    }, 1200);
  };

  const handleQuickChip = (chipText: string) => {
    setInputMessage(chipText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] max-h-[680px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Pusat Pesan & Obrolan Antar-Pengguna
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Real-time P2P
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Komunikasi langsung sesama mahasiswa & petugas TPST untuk transaksi bursa reuse dan titip sampah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body: Two Columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Thread List */}
          <div className="w-72 sm:w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
            {/* Search thread */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama rekan atau barang..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredThreads.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Tidak ada percakapan yang cocok.
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isSelected = thread.id === selectedThreadId;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`p-3 cursor-pointer transition-all flex items-start gap-3 text-left ${
                        isSelected
                          ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={thread.participantAvatar}
                          alt={thread.participantName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                            thread.onlineStatus === 'online'
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {thread.participantName}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {thread.lastTimestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {thread.participantRole}
                        </div>
                        <p className="text-[11px] text-slate-600 truncate mt-1">
                          {thread.lastMessage}
                        </p>
                        {thread.itemContext && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded max-w-fit truncate">
                            <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{thread.itemContext.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Peer Directory Bar */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">
                Terhubung dengan {DEMO_ACCOUNTS.length}+ Pengguna Kampus
              </span>
            </div>
          </div>

          {/* Right Column: Active Thread */}
          {currentThread ? (
            <div className="flex-1 flex flex-col bg-slate-50/40 min-w-0">
              {/* Chat Header */}
              <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={currentThread.participantAvatar}
                      alt={currentThread.participantName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        currentThread.onlineStatus === 'online'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {currentThread.participantName}
                      </h4>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {currentThread.onlineStatus === 'online' ? 'Aktif' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {currentThread.participantRole} • {currentThread.participantFaculty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      onOpenUserProfile &&
                      onOpenUserProfile(
                        currentThread.participantId,
                        currentThread.participantName
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Profil Pengguna</span>
                  </button>
                </div>
              </div>

              {/* Item context banner if applicable */}
              {currentThread.itemContext && (
                <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentThread.itemContext.imageUrl}
                      alt={currentThread.itemContext.title}
                      className="w-9 h-9 rounded-lg object-cover border border-amber-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {currentThread.itemContext.title}
                      </div>
                      <div className="text-emerald-700 font-semibold text-[11px]">
                        {currentThread.itemContext.price}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold text-[10px] shrink-0">
                    Barang Reuse Terkait
                  </span>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    Percakapan Aman Terverifikasi Kampus
                  </span>
                </div>

                {currentThread.messages.map((msg) => {
                  const isSelf = msg.isSelf;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isSelf ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                          isSelf
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {msg.itemTitle && (
                          <div
                            className={`mb-1.5 pb-1 border-b text-[10px] font-medium ${
                              isSelf
                                ? 'border-emerald-500/60 text-emerald-100'
                                : 'border-slate-100 text-slate-500'
                            }`}
                          >
                            Membahas: {msg.itemTitle}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                            isSelf ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isSelf && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 italic bg-white border border-slate-200 px-3 py-1.5 rounded-full max-w-fit animate-pulse">
                    <span>{currentThread.participantName} sedang mengetik...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion chips */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  Pesan Cepat:
                </span>
                {[
                  'Barang masih ada kak?',
                  'Bisa COD di Lobi FT besok?',
                  'Bisa nego harganya?',
                  'Sampah sudah dipilah rapi 👍',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan kepada rekan mahasiswa..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className={`p-2 rounded-xl text-white transition-all ${
                    inputMessage.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Pilih percakapan di sebelah kiri</p>
              <p className="text-xs text-slate-500">
                Hubungi penjual di Bursa Reuse atau sapa sesama penggiat 3R kampus
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
