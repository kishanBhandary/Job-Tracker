'use server'

import * as auth from '@/lib/auth'

export async function signUpUser(email: string, password: string, name: string) {
  return auth.signUpUser(email, password, name)
}

export async function signInUser(email: string, password: string) {
  return auth.signInUser(email, password)
}

export async function signOutUser() {
  return auth.signOutUser()
}

export async function updateProfile(name: string) {
  return auth.updateProfile(name)
}

export async function changePassword(newPassword: string) {
  return auth.changePassword(newPassword)
}

export async function sendPasswordResetLink(email: string) {
  return auth.sendPasswordResetLink(email)
}
