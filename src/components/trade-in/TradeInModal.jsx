import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, MessageCircle, RefreshCw, X } from 'lucide-react';
import { formatPrice } from '../../lib/formatPrice';
import { productDisplayName } from '../../lib/productCopy';
import { whatsappUrl } from '../../config/store';
import {
  backOptions,
  batteryOptions,
  cameraOptions,
  iphoneModels,
  screenOptions,
  storageOptions,
  systemOptions,
} from './tradeInOptions';

const stepsTotal = 7;
const emptyForm = {
  model: '',
  storage: '',
  battery: '',
  screen: '',
  back: '',
  camera: [],
  system: [],
};

function batteryRange(value) {
  if (value === 'Alta') return '100-90';
  if (value === 'Media') return '90-85';
  if (value === 'Baja') return 'inferior a 85';
  return '';
}

function joinMultiple(values) {
  return values.length ? values.join(', ') : 'Sin detalles';
}

function RadioCards({ name, value, options, onChange }) {
  return <div className="trade-in-options">
    {options.map((option) => {
      const item = typeof option === 'string' ? { value: option } : option;
      return <label key={item.value} className="trade-in-option">
        <input type="radio" name={name} checked={value === item.value} onChange={() => onChange(item.value)} />
        <span><strong>{item.value}</strong>{item.detail && <small>{item.detail}</small>}</span>
      </label>;
    })}
  </div>;
}

function CheckboxCards({ values, options, onChange }) {
  return <div className="trade-in-options">
    {options.map((option) => {
      const item = typeof option === 'string' ? { value: option } : option;
      return <label key={item.value} className="trade-in-option">
        <input type="checkbox" checked={values.includes(item.value)} onChange={() => onChange(item.value)} />
        <span><strong>{item.value}</strong>{item.detail && <small>{item.detail}</small>}</span>
      </label>;
    })}
  </div>;
}

function TradeInStepModel({ form, setForm }) {
  return <div className="trade-in-step">
    <h3>1. ¿Qué modelo de iPhone es?</h3>
    <label className="trade-in-field">Modelo de iPhone<select value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })}><option value="">Elegí un modelo</option>{iphoneModels.map((model) => <option key={model} value={model}>{model}</option>)}</select></label>
    <div className="trade-in-field"><span>Almacenamiento</span><RadioCards name="trade-storage" value={form.storage} options={storageOptions} onChange={(storage) => setForm({ ...form, storage })} /></div>
    {form.model && form.storage && <p className="trade-in-selected">Seleccionaste: <strong>{form.model} {form.storage}</strong></p>}
  </div>;
}

function TradeInStepBattery({ form, setForm }) {
  return <div className="trade-in-step">
    <p className="trade-in-device">Tu dispositivo: <strong>{form.model} {form.storage}</strong></p>
    <h3>2. Batería</h3>
    <RadioCards name="trade-battery" value={form.battery} options={batteryOptions} onChange={(battery) => setForm({ ...form, battery })} />
  </div>;
}

function TradeInStepScreen({ form, setForm }) {
  return <div className="trade-in-step">
    <h3>3. Pantalla</h3>
    <RadioCards name="trade-screen" value={form.screen} options={screenOptions} onChange={(screen) => setForm({ ...form, screen })} />
  </div>;
}

function TradeInStepBack({ form, setForm }) {
  return <div className="trade-in-step">
    <h3>4. Tapa</h3>
    <RadioCards name="trade-back" value={form.back} options={backOptions} onChange={(back) => setForm({ ...form, back })} />
  </div>;
}

function toggleExclusive(values, selected) {
  if (selected === 'Sin detalles') return ['Sin detalles'];
  const withoutNone = values.filter((value) => value !== 'Sin detalles');
  return withoutNone.includes(selected)
    ? withoutNone.filter((value) => value !== selected)
    : [...withoutNone, selected];
}

function TradeInStepCamera({ form, setForm }) {
  return <div className="trade-in-step">
    <h3>5. Cámara</h3>
    <CheckboxCards values={form.camera} options={cameraOptions} onChange={(item) => setForm({ ...form, camera: toggleExclusive(form.camera, item) })} />
  </div>;
}

function TradeInStepSystem({ form, setForm }) {
  return <div className="trade-in-step">
    <h3>6. Funcionamiento del Sistema</h3>
    <CheckboxCards values={form.system} options={systemOptions} onChange={(item) => setForm({ ...form, system: toggleExclusive(form.system, item) })} />
  </div>;
}

function TradeInSummary({ product, form }) {
  return <div className="trade-in-step">
    <h3>Resumen de tu canje</h3>
    <div className="trade-in-summary">
      <section>
        <span>Me interesa</span>
        <strong>{productDisplayName(product)}</strong>
        <p>{formatPrice(product.price, product.currency)}</p>
        {product.capacity && <p>Capacidad: {product.capacity}</p>}
        {product.color && <p>Color: {product.color}</p>}
        {product.battery != null && <p>Batería: {product.battery}%</p>}
      </section>
      <section>
        <span>Quiero entregar</span>
        <strong>{form.model} {form.storage}</strong>
        <p>Batería: {form.battery}{batteryRange(form.battery) ? ` (${batteryRange(form.battery)})` : ''}</p>
        <p>Pantalla: {form.screen}</p>
        <p>Tapa: {form.back}</p>
        <p>Cámara: {joinMultiple(form.camera)}</p>
        <p>Sistema: {joinMultiple(form.system)}</p>
      </section>
    </div>
    <div className="trade-in-warning"><CheckCircle2 size={18} />El valor final del equipo queda sujeto a revisión presencial.</div>
  </div>;
}

function buildMessage(product, form) {
  return [
    'Hola, quiero consultar por un Plan Canje.',
    '',
    'Me interesa:',
    productDisplayName(product),
    `Precio: ${formatPrice(product.price, product.currency)}`,
    product.capacity ? `Capacidad: ${product.capacity}` : null,
    product.color ? `Color: ${product.color}` : null,
    product.battery != null ? `Batería del producto: ${product.battery}%` : null,
    '',
    'Quiero entregar:',
    `${form.model} ${form.storage}`,
    `Batería: ${form.battery}${batteryRange(form.battery) ? ` (${batteryRange(form.battery)})` : ''}`,
    `Pantalla: ${form.screen}`,
    `Tapa: ${form.back}`,
    `Cámara: ${joinMultiple(form.camera)}`,
    `Funcionamiento: ${joinMultiple(form.system)}`,
    '',
    'Quedo atento a la cotización.',
  ].filter(Boolean).join('\n');
}

export default function TradeInModal({ product, open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return undefined;
    setStep(0);
    setForm(emptyForm);
    document.body.classList.add('trade-in-open');
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('trade-in-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, product?.id, onClose]);

  const isValidStep = useMemo(() => {
    if (step === 0) return Boolean(form.model && form.storage);
    if (step === 1) return Boolean(form.battery);
    if (step === 2) return Boolean(form.screen);
    if (step === 3) return Boolean(form.back);
    if (step === 4) return form.camera.length > 0;
    if (step === 5) return form.system.length > 0;
    return true;
  }, [form, step]);

  if (!open || !product) return null;

  const progress = ((step + 1) / stepsTotal) * 100;
  const steps = [
    <TradeInStepModel key="model" form={form} setForm={setForm} />,
    <TradeInStepBattery key="battery" form={form} setForm={setForm} />,
    <TradeInStepScreen key="screen" form={form} setForm={setForm} />,
    <TradeInStepBack key="back" form={form} setForm={setForm} />,
    <TradeInStepCamera key="camera" form={form} setForm={setForm} />,
    <TradeInStepSystem key="system" form={form} setForm={setForm} />,
    <TradeInSummary key="summary" product={product} form={form} />,
  ];

  return createPortal(<div className="trade-in-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="trade-in-modal" role="dialog" aria-modal="true" aria-labelledby="trade-in-title">
      <button className="icon-button trade-in-close" type="button" aria-label="Cerrar Plan Canje" onClick={onClose}><X size={22} /></button>
      <div className="trade-in-header">
        <span><RefreshCw size={17} />Plan Canje</span>
        <h2 id="trade-in-title">Me interesa: {productDisplayName(product)} - {formatPrice(product.price, product.currency)}</h2>
        <p>Paso {step + 1} de {stepsTotal}</p>
        <div className="trade-in-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="trade-in-body">{steps[step]}</div>
      <div className="trade-in-actions">
        <button className="button button-outline" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ChevronLeft size={17} />Anterior</button>
        {step === stepsTotal - 1
          ? <a className="button trade-in-whatsapp" href={whatsappUrl(buildMessage(product, form))} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a>
          : <button className="button button-dark" type="button" onClick={() => setStep(Math.min(stepsTotal - 1, step + 1))} disabled={!isValidStep}>Siguiente<ChevronRight size={17} /></button>}
      </div>
    </section>
  </div>, document.body);
}
