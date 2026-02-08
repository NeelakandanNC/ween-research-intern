import { useState, useEffect, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext({})

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = (message, type = 'info', duration = 4000) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const success = (message, duration) => addToast(message, 'success', duration)
    const error = (message, duration) => addToast(message, 'error', duration)
    const info = (message, duration) => addToast(message, 'info', duration)

    return (
        <ToastContext.Provider value={{ addToast, success, error, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

const Toast = ({ toast, onClose }) => {
    const [isExiting, setIsExiting] = useState(false)

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(onClose, 200)
    }

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    }

    const backgrounds = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    }

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg 
        ${backgrounds[toast.type]} 
        ${isExiting ? 'animate-fade-out' : 'animate-slide-up'}
        min-w-[300px] max-w-[400px]
      `}
            style={{
                animation: isExiting
                    ? 'fadeOut 0.2s ease-out forwards'
                    : 'slideUp 0.3s ease-out'
            }}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
            <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>
        </div>
    )
}

export default Toast
