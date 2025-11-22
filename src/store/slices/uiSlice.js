import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSidebarOpen: true,
  isModalOpen: false,
  modalContent: null,
  notification: null,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload
    },
    openModal: (state, action) => {
      state.isModalOpen = true
      state.modalContent = action.payload
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.modalContent = null
    },
    showNotification: (state, action) => {
      state.notification = action.payload
    },
    hideNotification: (state) => {
      state.notification = null
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showNotification,
  hideNotification,
  setTheme,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen
export const selectIsModalOpen = (state) => state.ui.isModalOpen
export const selectModalContent = (state) => state.ui.modalContent
export const selectNotification = (state) => state.ui.notification
export const selectTheme = (state) => state.ui.theme
