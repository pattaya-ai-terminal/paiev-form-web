import { Card } from 'antd';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <Card className="auth-card" bordered={false}>
      <div className="auth-header">
        <p className="auth-kicker">PAIEV • Secure Portal</p>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
      </div>
      <div className="auth-body">{children}</div>
      {footer ? <div className="auth-footer">{footer}</div> : null}
    </Card>
  );
}
