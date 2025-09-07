import React from "react";
import { Button } from "../ui/button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur capturée :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
