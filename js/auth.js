import { supabase } from './supabase.js'

// DOM Elements
const authBtn = document.getElementById('auth-btn')
const authModal = document.getElementById('auth-modal')
const closeModal = document.getElementById('close-modal')
const authForm = document.getElementById('auth-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const submitBtn = document.getElementById('submit-auth')
const formTitle = document.getElementById('modal-title')
const switchText = document.getElementById('switch-text')
const switchAuthLink = document.getElementById('switch-auth')
const authError = document.getElementById('auth-error')

let isSignUp = false

// Initialize
function init() {
    console.log('Auth module initializing...')

    // Check for Supabase keys
    if (!supabase.supabaseUrl || !supabase.supabaseKey) {
        console.warn('Supabase not configured')
        if (authBtn) authBtn.style.display = 'none'
        return
    }

    // Set initial UI state based on session
    supabase.auth.getSession().then(({ data: { session } }) => {
        updateAuthUI(session)
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event)
        updateAuthUI(session)
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            closeModalHandler()
        }
    })

    setupEventListeners()
}

function setupEventListeners() {
    if (!authBtn) return

    authBtn.addEventListener('click', () => {
        const isLoggedIn = authBtn.dataset.loggedIn === 'true'
        if (isLoggedIn) {
            handleLogout()
        } else {
            openModal()
        }
    })

    if (closeModal) {
        closeModal.addEventListener('click', closeModalHandler)
    }

    if (authModal) {
        window.addEventListener('click', (e) => {
            if (e.target === authModal) closeModalHandler()
        })
    }

    if (switchAuthLink) {
        switchAuthLink.addEventListener('click', (e) => {
            e.preventDefault()
            isSignUp = !isSignUp
            updateModalMode()
        })
    }

    if (authForm) {
        authForm.addEventListener('submit', handleAuth)
    }
}

function updateAuthUI(session) {
    if (!authBtn) return

    if (session) {
        authBtn.textContent = 'ログアウト'
        authBtn.dataset.loggedIn = 'true'
        authBtn.classList.add('logged-in')
        console.log('User:', session.user.email)
    } else {
        authBtn.textContent = 'ログイン'
        authBtn.dataset.loggedIn = 'false'
        authBtn.classList.remove('logged-in')
    }
}

function openModal() {
    authModal.classList.remove('hidden')
    isSignUp = false
    updateModalMode()
    authError.textContent = ''
    emailInput.value = ''
    passwordInput.value = ''
}

function closeModalHandler() {
    authModal.classList.add('hidden')
}

function updateModalMode() {
    if (isSignUp) {
        formTitle.textContent = 'アカウント作成'
        submitBtn.textContent = 'サインアップ'
        switchText.textContent = 'すでにアカウントをお持ちですか？'
        switchAuthLink.textContent = 'ログイン'
    } else {
        formTitle.textContent = 'ログイン'
        submitBtn.textContent = 'ログイン'
        switchText.textContent = 'アカウントをお持ちでないですか？'
        switchAuthLink.textContent = 'サインアップ'
    }
    authError.textContent = ''
}

async function handleAuth(e) {
    e.preventDefault()

    const email = emailInput.value
    const password = passwordInput.value

    if (!email || !password) {
        showError('メールアドレスとパスワードを入力してください')
        return
    }

    setLoading(true)

    try {
        let result
        if (isSignUp) {
            result = await supabase.auth.signUp({
                email,
                password,
            })
        } else {
            result = await supabase.auth.signInWithPassword({
                email,
                password,
            })
        }

        const { data, error } = result

        if (error) throw error

        if (isSignUp && !data.session) {
            showError('確認メールを送信しました。メールボックスを確認してください。')
            // Don't close modal yet, let them see message
        }

    } catch (error) {
        console.error('Auth error:', error)
        showError(translateError(error.message))
    } finally {
        setLoading(false)
    }
}

async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        console.error('Logout error:', error)
    }
}

function showError(message) {
    authError.textContent = message
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading
    submitBtn.textContent = isLoading ? '処理中...' : (isSignUp ? 'サインアップ' : 'ログイン')
}

function translateError(message) {
    // Simple translation mapping
    if (message.includes('Invalid login credentials')) return 'メールアドレスまたはパスワードが正しくありません'
    if (message.includes('User already registered')) return 'すでに登録されているメールアドレスです'
    return message
}

// Start everything
init()
