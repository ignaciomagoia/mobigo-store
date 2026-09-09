import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Check, Copy, MessageCircle, X } from 'lucide-react';
import { store, whatsappUrl } from '../config/store';

const ContactContext = createContext(null);
export function ContactProvider({ children }) {
  const [contact, setContact] = useState(null);
  const [copied, setCopied] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (contact) { setCopied(false); dialog.current.showModal(); }
    else dialog.current.close();
  }, [contact]);
  async function copyMessage() {
    try { await navigator.clipboard.writeText(contact.message); setCopied(true); }
    catch { setCopied(false); }
  }
  return <ContactContext.Provider value={setContact}>
    {children}
    <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-dialog-title" onClose={() => setContact(null)} onClick={(event) => { if (event.target === dialog.current) setContact(null); }}>
      <button className="icon-button dialog-close" aria-label="Cerrar" onClick={() => setContact(null)}><X size={22} /></button>
      <span className="contact-dialog-icon"><MessageCircle size={30} /></span>
      <p className="eyebrow">ESTAMOS PREPARANDO TODO</p>
      <h2 id="contact-dialog-title">Pronto, más cerca tuyo.</h2>
      <p>{contact?.type === 'instagram' ? 'Nuestro Instagram estará disponible muy pronto. Volvé a visitarnos para descubrir las novedades.' : 'El canal de WhatsApp estará disponible muy pronto. Mientras tanto, podés copiar tu consulta para guardarla.'}</p>
      {contact?.type !== 'instagram' && <><div className="message-preview">{contact?.message}</div><button className="button button-dark" onClick={copyMessage}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? 'Consulta copiada' : 'Copiar consulta'}</button><span role="status" className="sr-only">{copied ? 'Consulta copiada al portapapeles' : ''}</span></>}
    </dialog>
  </ContactContext.Provider>;
}

export function WhatsAppButton({ children = 'Consultar por WhatsApp', message = '¡Hola, MobiGo! Quiero consultar por un producto.', className = 'button button-dark', icon = true, ...props }) {
  const openContact = useContext(ContactContext);
  const content = <>{icon && <MessageCircle size={18} strokeWidth={1.8} />}{children}</>;
  return store.whatsappNumber
    ? <a href={whatsappUrl(message)} target="_blank" rel="noreferrer" className={className} {...props}>{content}</a>
    : <button className={className} onClick={() => openContact({ type: 'whatsapp', message })} {...props}>{content}</button>;
}

export function InstagramLink({ children, className }) {
  const openContact = useContext(ContactContext);
  return store.instagramUsername
    ? <a className={className} href={`https://www.instagram.com/${encodeURIComponent(store.instagramUsername)}/`} target="_blank" rel="noreferrer">{children}</a>
    : <button className={className} onClick={() => openContact({ type: 'instagram' })}>{children}</button>;
}
