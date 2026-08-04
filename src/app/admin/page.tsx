"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

export default function AdminSyncDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  useEffect(() => {
    // Check authentication
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    // Fetch initial sync logs
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await apiService.getAdminSyncLogs();
        if (res.success) {
          setLogs(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin sync logs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [router]);

  const handleSyncTrigger = async () => {
    setSyncing(true);
    setSyncStatus("Connecting to TREB/MLS® property exchange registries...");
    try {
      // Small timeout simulation for rich dynamic feel
      setTimeout(async () => {
        setSyncStatus("Importing active listings for Oakville, Brampton, and Toronto...");
        try {
          const res = await apiService.triggerAdminSync();
          if (res.success) {
            setSyncStatus("Properties updated successfully! Re-indexing AI assistant databases...");
            setTimeout(async () => {
              // Refresh logs
              const logRes = await apiService.getAdminSyncLogs();
              if (logRes.success) {
                setLogs(logRes.data || []);
              }
              setSyncing(false);
              setSyncStatus("");
            }, 1000);
          } else {
            setSyncStatus(`Sync Failed: ${res.message}`);
            setSyncing(false);
          }
        } catch (err) {
          setSyncStatus("Sync failed. Check remote registry credentials.");
          setSyncing(false);
        }
      }, 1500);
    } catch (err) {
      setSyncing(false);
      setSyncStatus("");
    }
  };

  const handleLogout = () => {
    apiService.logout();
    router.push("/");
    router.refresh();
  };

  if (loading || !user) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "8rem 0" }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Authorizing Administrator session...</p>
        <style jsx>{`
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--border-light);
            border-top-color: var(--text-primary);
            border-radius: 50%;
            animation: spin 1s infinite linear;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container header-inner">
          <div className="header-meta">
            <span className="badge badge-admin">TREB Integration Console</span>
            <h1>Broker Integration Portal</h1>
            <p className="admin-details">
              Logged in as: <strong>{user.firstName} {user.lastName}</strong> • System Admin
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Admin Sign Out</button>
        </div>
      </div>

      <div className="container section admin-layout">
        <div className="control-panel">
          <h2>MLS® Sync Operations</h2>
          <p className="panel-desc">
            Manually trigger synchronization routines against the Toronto Regional Real Estate Board (TRREB) MLS® database system. This job imports and syncs active properties, photo assets, and updates listing prices.
          </p>

          {syncing ? (
            <div className="sync-status-box">
              <div className="sync-spinner"></div>
              <p className="status-text">{syncStatus}</p>
            </div>
          ) : (
            <button onClick={handleSyncTrigger} className="trigger-sync-btn">
              Trigger Live MLS® Sync Job
            </button>
          )}

          <div className="integration-parameters-card">
            <h4>Connector Parameters</h4>
            <div className="param-item">
              <span>TRREB Registry URL</span>
              <code>https://api.treb.ca/v2/rets/sync</code>
            </div>
            <div className="param-item">
              <span>Authentication Token</span>
              <code>Active (SHA-256 Signature)</code>
            </div>
            <div className="param-item">
              <span>Target Region Filter</span>
              <code>GTA / Oakville / Brampton / Toronto</code>
            </div>
          </div>
        </div>

        <div className="logs-panel">
          <h2>Execution Sync Logs</h2>
          <p className="panel-desc" style={{ marginBottom: "1.5rem" }}>
            Audit history of recently finished sync cron jobs and manual triggers.
          </p>

          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="empty-logs">
                <p>No recent synchronization runs in registry audits.</p>
              </div>
            ) : (
              <div className="logs-list">
                {logs.map((log) => (
                  <div key={log.id} className="log-card">
                    <div className="log-card-header">
                      <span className={`status-tag ${log.status.toLowerCase()}`}>{log.status}</span>
                      <span className="log-time">
                        {new Date(log.startTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="log-card-body">
                      <p><strong>Triggered By</strong>: {log.triggeredBy}</p>
                      <p><strong>Processed</strong>: {log.propertiesSynced} listings synchronized</p>
                      {log.notes && <p className="log-notes"><em>Audit notes: {log.notes}</em></p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
        }

        .header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
        }

        .badge-admin {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .admin-details {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .logout-btn {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
          padding: 0.6rem 1.2rem;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .admin-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .panel-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .trigger-sync-btn {
          width: 100%;
          background: var(--bg-dark);
          color: #ffffff;
          border: none;
          padding: 1.15rem;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          cursor: pointer;
          margin-bottom: 2rem;
          transition: opacity 0.2s ease;
        }

        .trigger-sync-btn:hover {
          opacity: 0.9;
        }

        .sync-status-box {
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          padding: 2rem;
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: 2rem;
        }

        .sync-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--border-light);
          border-top-color: var(--text-primary);
          border-radius: 50%;
          animation: spin 1s infinite linear;
          margin: 0 auto 1rem;
        }

        .status-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .integration-parameters-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }

        .integration-parameters-card h4 {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.5rem;
        }

        .param-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          margin-bottom: 0.75rem;
        }

        .param-item span {
          color: var(--text-secondary);
        }

        .param-item code {
          background: var(--bg-subtle);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .logs-container {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          max-height: 480px;
          overflow-y: auto;
        }

        .empty-logs {
          text-align: center;
          color: var(--text-muted);
          padding: 3rem 1rem;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .log-card {
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .log-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .log-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .status-tag {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .status-tag.success {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-tag.failed {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .log-time {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .log-card-body p {
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
          color: var(--text-secondary);
        }

        .log-notes {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .admin-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
