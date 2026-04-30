import React from 'react';
import { Navigate } from 'react-router';

export default function RedirectToBeranda() {
  return <Navigate to="/beranda" replace />;
}
