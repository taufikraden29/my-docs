import toast from 'react-hot-toast'

/**
 * Custom toast utility functions with consistent styling
 */

export const showToast = {
  /**
   * Success toast
   * @param {string} message - The success message to display
   * @param {object} options - Additional options
   */
  success: (message, options = {}) => {
    toast.success(message, {
      ...options,
    })
  },

  /**
   * Error toast
   * @param {string} message - The error message to display
   * @param {object} options - Additional options
   */
  error: (message, options = {}) => {
    toast.error(message, {
      ...options,
    })
  },

  /**
   * Info toast
   * @param {string} message - The info message to display
   * @param {object} options - Additional options
   */
  info: (message, options = {}) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        border: '1px solid #dbeafe',
        background: '#eff6ff',
      },
      ...options,
    })
  },

  /**
   * Warning toast
   * @param {string} message - The warning message to display
   * @param {object} options - Additional options
   */
  warning: (message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      style: {
        border: '1px solid #fef3c7',
        background: '#fffbeb',
      },
      ...options,
    })
  },

  /**
   * Loading toast
   * @param {string} message - The loading message to display
   * @returns {string} Toast ID for dismissing later
   */
  loading: (message) => {
    return toast.loading(message)
  },

  /**
   * Promise toast - automatically handles loading, success, and error states
   * @param {Promise} promise - The promise to track
   * @param {object} messages - Success and error messages
   */
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    })
  },

  /**
   * Custom toast with full control
   * @param {string} message - The message to display
   * @param {object} options - Custom options
   */
  custom: (message, options = {}) => {
    toast(message, options)
  },

  /**
   * Dismiss a specific toast or all toasts
   * @param {string} toastId - Optional toast ID to dismiss specific toast
   */
  dismiss: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },

  /**
   * Action toast with button
   * @param {string} message - The message to display
   * @param {string} actionText - Button text
   * @param {function} onAction - Callback when button is clicked
   */
  action: (message, actionText, onAction) => {
    toast.custom(
      (t) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#fff',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <span style={{ flex: 1, fontWeight: '500' }}>{message}</span>
          <button
            onClick={() => {
              onAction()
              toast.dismiss(t.id)
            }}
            style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {actionText}
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#9ca3af',
            }}
          >
            ×
          </button>
        </div>
      ),
      {
        duration: 10000,
      }
    )
  },
}

// Export default toast for direct usage
export default toast
