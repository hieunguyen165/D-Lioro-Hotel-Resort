import React, { useState, useMemo, useRef } from 'react';
import { 
  Hotel, 
  User, 
  Calendar, 
  Baby, 
  Users, 
  Bed, 
  FileText, 
  Calculator, 
  Printer, 
  Copy, 
  CheckCircle2,
  Info,
  Settings,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  LayoutDashboard,
  Image as ImageIcon,
  Mail
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { OccupancyLevel, QuotationData, SeasonConfig, RoomRate, SurchargeRules, Season, SeasonRange } from './types';
import { ROOM_RATES, SEASONS_2026, SURCHARGE_RULES, DEFAULT_INCLUDED_POLICIES, DEFAULT_TERMS_CONDITIONS } from './constants';
import { calculateQuotation, formatCurrency, QuotationResult, SurchargeItem } from './utils/calculator';
import { generateEmailHtml } from './utils/emailGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quotation' | 'settings'>('quotation');
  
  // Settings State
  const [roomRates, setRoomRates] = useState<RoomRate[]>(() => {
    const saved = localStorage.getItem('hotel_room_rates');
    return saved ? JSON.parse(saved) : ROOM_RATES;
  });
  
  const [seasons, setSeasons] = useState<SeasonConfig>(() => {
    const saved = localStorage.getItem('hotel_seasons');
    return saved ? JSON.parse(saved) : SEASONS_2026;
  });

  const [surchargeRules, setSurchargeRules] = useState<SurchargeRules>(() => {
    const saved = localStorage.getItem('hotel_surcharges');
    return saved ? JSON.parse(saved) : SURCHARGE_RULES;
  });

  const [includedPolicies, setIncludedPolicies] = useState<string>(() => {
    const saved = localStorage.getItem('hotel_included_policies');
    return saved || DEFAULT_INCLUDED_POLICIES;
  });

  const [termsConditions, setTermsConditions] = useState<string>(() => {
    const saved = localStorage.getItem('hotel_terms_conditions');
    return saved || DEFAULT_TERMS_CONDITIONS;
  });

  const [formData, setFormData] = useState<QuotationData>({
    guestName: '',
    checkIn: '2026-01-02',
    checkOut: '2026-01-03',
    rooms: [{ roomCode: 'SDD', count: 1 }],
    occupancyLevel: OccupancyLevel.BETWEEN_30_70,
    childrenUnder12: 0,
    childrenOver12: 0,
    extraAdults: 0,
    extraBeds: 0,
    notes: '',
  });

  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const quotationRef = useRef<HTMLDivElement>(null);

  const quotation = useMemo(() => 
    calculateQuotation(formData, roomRates, seasons, surchargeRules), 
  [formData, roomRates, seasons, surchargeRules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleRoomChange = (index: number, field: 'roomCode' | 'count', value: string | number) => {
    const newRooms = [...formData.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setFormData(prev => ({ ...prev, rooms: newRooms }));
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { roomCode: roomRates[0].code, count: 1 }]
    }));
  };

  const removeRoom = (index: number) => {
    if (formData.rooms.length > 1) {
      const newRooms = formData.rooms.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, rooms: newRooms }));
    }
  };

  const handleCopy = () => {
    const text = document.getElementById('quotation-result')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    if (!quotation) return;
    const html = generateEmailHtml(formData, quotation);
    try {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([html], { type: 'text/plain' });
      const data = [new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      })];
      await navigator.clipboard.write(data);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email HTML: ', err);
      // Fallback for browsers that don't support ClipboardItem
      navigator.clipboard.writeText(html);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (quotationRef.current === null) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(quotationRef.current, {
        cacheBust: true,
        backgroundColor: '#f8fafc', // slate-50 to match background
        style: {
          borderRadius: '0',
        }
      });
      
      const link = document.createElement('a');
      link.download = `Bao-Gia-Hotel-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not download image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('hotel_room_rates', JSON.stringify(roomRates));
    localStorage.setItem('hotel_seasons', JSON.stringify(seasons));
    localStorage.setItem('hotel_surcharges', JSON.stringify(surchargeRules));
    localStorage.setItem('hotel_included_policies', includedPolicies);
    localStorage.setItem('hotel_terms_conditions', termsConditions);
    alert('Đã lưu cài đặt thành công!');
  };

  const resetSettings = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
      setRoomRates(ROOM_RATES);
      setSeasons(SEASONS_2026);
      setSurchargeRules(SURCHARGE_RULES);
      setIncludedPolicies(DEFAULT_INCLUDED_POLICIES);
      setTermsConditions(DEFAULT_TERMS_CONDITIONS);
      localStorage.removeItem('hotel_room_rates');
      localStorage.removeItem('hotel_seasons');
      localStorage.removeItem('hotel_surcharges');
      localStorage.removeItem('hotel_included_policies');
      localStorage.removeItem('hotel_terms_conditions');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 print:hidden">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Hotel size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">Hotel Quotation Pro</h1>
              <p className="text-slate-50 text-[10px] bg-blue-600/10 px-1.5 py-0.5 rounded text-blue-600 inline-block">Hệ thống báo giá chuyên nghiệp</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('quotation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'quotation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard size={18} />
              Báo giá
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Settings size={18} />
              Cài đặt
            </button>
          </div>
        </header>

        {activeTab === 'quotation' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form */}
            <div className="lg:col-span-5 space-y-4 print:hidden">
              <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <FileText className="text-blue-600" size={18} />
                  <h2 className="font-semibold text-base">Thông tin đặt phòng</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Tên khách hàng</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên khách..."
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Ngày Check-in</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Ngày Check-out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-500 uppercase">Hạng phòng & Số lượng</label>
                      <button 
                        onClick={addRoom}
                        className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus size={14} /> Thêm phòng
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.rooms.map((room, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <select
                            value={room.roomCode}
                            onChange={(e) => handleRoomChange(index, 'roomCode', e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none"
                          >
                            {roomRates.map(r => (
                              <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={room.count}
                            onChange={(e) => handleRoomChange(index, 'count', parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-center"
                          />
                          {formData.rooms.length > 1 && (
                            <button 
                              onClick={() => removeRoom(index)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Công suất phòng (%OCC)</label>
                    <select
                      name="occupancyLevel"
                      value={formData.occupancyLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none"
                    >
                      <option value={OccupancyLevel.OVER_70}>Trên 70%</option>
                      <option value={OccupancyLevel.BETWEEN_30_70}>30% - 70%</option>
                      <option value={OccupancyLevel.UNDER_30}>Dưới 30%</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <Users className="text-blue-600" size={18} />
                  <h2 className="font-semibold text-base">Phụ thu (mỗi phòng)</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <Baby size={14} /> Trẻ em 6-11 tuổi
                      </label>
                      <input
                        type="number"
                        name="childrenUnder12"
                        min="0"
                        value={formData.childrenUnder12}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <Users size={14} /> Trẻ em &ge; 12 tuổi
                      </label>
                      <input
                        type="number"
                        name="childrenOver12"
                        min="0"
                        value={formData.childrenOver12}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <Users size={14} /> Người lớn
                      </label>
                      <input
                        type="number"
                        name="extraAdults"
                        min="0"
                        value={formData.extraAdults}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <Bed size={14} /> Extra Bed
                      </label>
                      <input
                        type="number"
                        name="extraBeds"
                        min="0"
                        value={formData.extraBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Nhập ghi chú..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Right Column: Result */}
            <div className="lg:col-span-7">
              <div className="sticky top-4 space-y-4">
                <div ref={quotationRef} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
                  {/* Quotation Header */}
                  <div className="bg-slate-900 text-white p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-0.5 uppercase tracking-tight">BÁO GIÁ PHÒNG</h3>
                        <p className="text-slate-400 text-[10px]">Mã số: QT-{new Date().getTime().toString().slice(-6)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">HOTEL QUOTATION PRO</p>
                        <p className="text-slate-400 text-[10px]">Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Content */}
                  <div id="quotation-result" className="p-5 space-y-4">
                    {quotation ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khách hàng</p>
                            <p className="font-bold text-base text-slate-800">{formData.guestName || '(Chưa nhập tên)'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian lưu trú</p>
                            <p className="font-semibold text-sm">{formData.checkIn} đến {formData.checkOut}</p>
                            <p className="text-xs text-blue-600 font-bold">{quotation.numNights} đêm | {quotation.totalRoomCount} phòng</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi tiết giá phòng</p>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-3">
                            {quotation.rooms.map((room, idx) => (
                              <div key={idx} className={idx > 0 ? 'pt-2 border-t border-slate-200' : ''}>
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="font-bold text-sm text-slate-700">
                                    {room.name} 
                                    <span className="text-slate-400 ml-1.5 font-normal">(x {room.count})</span>
                                  </span>
                                  <span className="text-blue-600 font-bold text-sm">{formatCurrency(room.totalRate)}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 italic">Giá TB: {formatCurrency(room.totalRate / (room.count * quotation.numNights))}/đêm/phòng</p>
                              </div>
                            ))}
                            <div className="mt-2 pt-2 border-t-2 border-slate-200 flex justify-between font-bold text-base">
                              <span>Tổng tiền phòng</span>
                              <span className="text-blue-600">{formatCurrency(quotation.totalRoomRate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phụ thu chi tiết</p>
                          <div className="space-y-1.5">
                            {(Object.entries(quotation.surchargeBreakdown) as [string, SurchargeItem][]).map(([key, value]) => (
                              value.count > 0 && (
                                <div key={key} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                    <span className="text-slate-600">
                                      {key === 'childrenUnder12' && 'Trẻ em 6-11 tuổi'}
                                      {key === 'childrenOver12' && 'Trẻ em ≥ 12 tuổi'}
                                      {key === 'extraAdults' && 'Người lớn thêm'}
                                      {key === 'extraBeds' && 'Extra Bed'}
                                      <span className="text-slate-400 ml-1">({value.count} x {formatCurrency(value.rate)})</span>
                                    </span>
                                  </div>
                                  <span className="font-semibold">{formatCurrency(value.total)}</span>
                                </div>
                              )
                            ))}
                            {quotation.totalSurcharge === 0 && (
                              <p className="text-xs text-slate-400 italic">Không có phụ thu</p>
                            )}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm">
                          <span>Tổng phụ thu</span>
                          <span className="text-blue-600">{formatCurrency(quotation.totalSurcharge)}</span>
                        </div>
                      </div>

                      {formData.notes && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ghi chú</p>
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-800 italic">
                            {formData.notes}
                          </div>
                        </div>
                      )}

                      <div className="pt-5 border-t-2 border-dashed border-slate-200">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Tổng cộng thanh toán</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(quotation.grandTotal)}</p>
                          </div>
                          <div className="text-right text-[9px] text-slate-400 leading-tight">
                            <p>Báo giá có giá trị trong vòng 24h</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Giá trên đã bao gồm:</p>
                          <ul className="list-disc pl-4 text-[10px] text-slate-600 space-y-0.5">
                            {includedPolicies.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Điều khoản đi kèm:</p>
                          <ul className="list-disc pl-4 text-[10px] text-slate-600 space-y-0.5">
                            {termsConditions.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Info size={24} />
                      </div>
                      <p className="text-slate-500 text-sm">Vui lòng nhập đầy đủ thông tin để xem báo giá.</p>
                    </div>
                  )}
                </div>

                {/* Quotation Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-wrap justify-center gap-2 print:hidden">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold shadow-sm"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Đã chép' : 'Sao chép'}
                  </button>
                  <button 
                    onClick={handleCopyEmail}
                    disabled={!quotation}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
                  >
                    {copiedEmail ? <CheckCircle2 size={16} className="text-green-500" /> : <Mail size={16} className="text-blue-600" />}
                    {copiedEmail ? 'Đã chép Email' : 'Copy Email'}
                  </button>
                  <button 
                    onClick={handleDownloadImage}
                    disabled={isDownloading || !quotation}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                      <ImageIcon size={16} className="text-blue-600" />
                    )}
                    Tải ảnh
                  </button>
                  <button 
                    onClick={handlePrint}
                    disabled={!quotation}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
                  >
                    <Printer size={16} />
                    In báo giá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Settings Tab Content */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Cấu hình hệ thống</h2>
                <p className="text-slate-500 text-sm">Điều chỉnh giá phòng, giai đoạn và phụ thu</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={resetSettings}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium"
                >
                  <RotateCcw size={18} />
                  Khôi phục mặc định
                </button>
                <button 
                  onClick={saveSettings}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
                >
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seasons Config */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-lg">Giai đoạn mùa</h3>
                  </div>
                </div>

                {Object.entries(seasons).map(([seasonKey, ranges]) => (
                  <div key={seasonKey} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        seasonKey === Season.LOW ? 'bg-slate-100 text-slate-600' :
                        seasonKey === Season.HIGH ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {seasonKey === Season.LOW ? 'Thấp điểm' : seasonKey === Season.HIGH ? 'Cao điểm' : 'Lễ'}
                      </span>
                      <button 
                        onClick={() => {
                          const newSeasons = { ...seasons };
                          newSeasons[seasonKey as Season].push({ start: '', end: '' });
                          setSeasons(newSeasons);
                        }}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(ranges as SeasonRange[]).map((range, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="date" 
                            value={range.start}
                            onChange={(e) => {
                              const newSeasons = { ...seasons };
                              newSeasons[seasonKey as Season][idx].start = e.target.value;
                              setSeasons(newSeasons);
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-slate-400">→</span>
                          <input 
                            type="date" 
                            value={range.end}
                            onChange={(e) => {
                              const newSeasons = { ...seasons };
                              newSeasons[seasonKey as Season][idx].end = e.target.value;
                              setSeasons(newSeasons);
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            onClick={() => {
                              const newSeasons = { ...seasons };
                              newSeasons[seasonKey as Season].splice(idx, 1);
                              setSeasons(newSeasons);
                            }}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* Surcharge Config */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Calculator className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-lg">Mức phụ thu</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Trẻ em 6-11 tuổi</label>
                    <input 
                      type="number" 
                      value={surchargeRules.childUnder12}
                      onChange={(e) => setSurchargeRules({...surchargeRules, childUnder12: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Trẻ em &ge; 12 tuổi</label>
                    <input 
                      type="number" 
                      value={surchargeRules.childOver12}
                      onChange={(e) => setSurchargeRules({...surchargeRules, childOver12: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Người lớn thêm</label>
                    <input 
                      type="number" 
                      value={surchargeRules.extraAdult}
                      onChange={(e) => setSurchargeRules({...surchargeRules, extraAdult: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Extra Bed</label>
                    <input 
                      type="number" 
                      value={surchargeRules.extraBed}
                      onChange={(e) => setSurchargeRules({...surchargeRules, extraBed: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>
            </div>

              {/* Policies Config */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <FileText className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-lg">Chính sách & Điều khoản</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Giá trên đã bao gồm (Mỗi dòng 1 mục)</label>
                    <textarea 
                      value={includedPolicies}
                      onChange={(e) => setIncludedPolicies(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Điều khoản đi kèm (Mỗi dòng 1 mục)</label>
                    <textarea 
                      value={termsConditions}
                      onChange={(e) => setTermsConditions(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </section>

            {/* Room Rates Config */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Bed className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-lg">Bảng giá phòng (BAR)</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Mã / Tên phòng</th>
                      <th className="px-4 py-3">Mùa</th>
                      <th className="px-4 py-3">Trên 70%</th>
                      <th className="px-4 py-3">30% - 70%</th>
                      <th className="px-4 py-3">Dưới 30%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roomRates.map((room, roomIdx) => (
                      <React.Fragment key={room.code}>
                        {[Season.HIGH, Season.LOW, Season.HOLIDAY].map((season, seasonIdx) => (
                          <tr key={season} className={seasonIdx === 0 ? 'border-t-2 border-slate-100' : ''}>
                            {seasonIdx === 0 && (
                              <td rowSpan={3} className="px-4 py-3 font-semibold align-top">
                                <div className="text-blue-600">{room.code}</div>
                                <div className="text-xs text-slate-400 font-normal">{room.name}</div>
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                season === Season.LOW ? 'bg-slate-100 text-slate-600' :
                                season === Season.HIGH ? 'bg-orange-100 text-orange-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {season === Season.LOW ? 'Thấp' : season === Season.HIGH ? 'Cao' : 'Lễ'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number" 
                                value={room.rates[season][OccupancyLevel.OVER_70]}
                                onChange={(e) => {
                                  const newRates = [...roomRates];
                                  newRates[roomIdx].rates[season][OccupancyLevel.OVER_70] = parseInt(e.target.value) || 0;
                                  setRoomRates(newRates);
                                }}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number" 
                                value={room.rates[season][OccupancyLevel.BETWEEN_30_70]}
                                onChange={(e) => {
                                  const newRates = [...roomRates];
                                  newRates[roomIdx].rates[season][OccupancyLevel.BETWEEN_30_70] = parseInt(e.target.value) || 0;
                                  setRoomRates(newRates);
                                }}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number" 
                                value={room.rates[season][OccupancyLevel.UNDER_30]}
                                onChange={(e) => {
                                  const newRates = [...roomRates];
                                  newRates[roomIdx].rates[season][OccupancyLevel.UNDER_30] = parseInt(e.target.value) || 0;
                                  setRoomRates(newRates);
                                }}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white; padding: 0; }
          .min-h-screen { min-height: auto; padding: 0; }
          header, .lg\\:col-span-5, .print\\:hidden, .flex.items-center.gap-2.bg-slate-100 { display: none !important; }
          .lg\\:col-span-12, .lg\\:col-span-7 { width: 100% !important; grid-column: span 12 / span 12 !important; }
          .max-w-7xl { max-width: none; }
          #quotation-result { padding: 0; }
          .shadow-xl { box-shadow: none !important; }
          .rounded-2xl { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
