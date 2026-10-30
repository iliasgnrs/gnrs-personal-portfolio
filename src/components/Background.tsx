import { memo } from 'react';

function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-800">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,29,227,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(245,29,227,0.16) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient mesh blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent-blue/20 blur-[120px] animate-mesh" />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-accent-violet/15 blur-[140px] animate-mesh"
        style={{ animationDelay: '5s' }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-cyan/15 blur-[120px] animate-mesh"
        style={{ animationDelay: '10s' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(23,23,23,0.7)_100%)]" />
    </div>
  );
}

export default memo(Background);
