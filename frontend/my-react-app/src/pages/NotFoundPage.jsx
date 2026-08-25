export default function NotFoundPage({ onBack }) {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <p>We couldn't find the page you're looking for.</p>
      {onBack && (
        <button className="edit-btn" onClick={onBack}>Go back home</button>
      )}
    </div>
  );
}