export const SPECIALTIES = [
  { key: 'labor', label: 'Mehnat huquqi' },
  { key: 'corporate', label: 'Korporativ huquq' },
  { key: 'contract', label: 'Shartnomalar' },
  { key: 'consumer', label: "Iste'molchi huquqlari" },
  { key: 'tax', label: 'Soliq' },
  { key: 'realestate', label: "Ko'chmas mulk" },
  { key: 'family', label: 'Oila huquqi' },
  { key: 'litigation', label: 'Sud jarayonlari' },
  { key: 'other', label: 'Boshqa' },
]
export const specLabel = (k) => SPECIALTIES.find(s => s.key === k)?.label || k
