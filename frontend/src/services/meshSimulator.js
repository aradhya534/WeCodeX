export class MeshSimulator {
  constructor() {
    this.listeners = [];
    this.isSimulating = false;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _notify(event) {
    this.listeners.forEach(cb => cb(event));
  }

  async simulateRelay(packet) {
    if (this.isSimulating) return;
    this.isSimulating = true;
    
    // Create a clone to simulate propagation
    let currentPacket = { ...packet };
    
    const peers = ['Device A', 'Device B', 'Device C', 'Device D', 'Device E'];
    const usedPeers = [];
    
    this._notify({ type: 'START', packet: currentPacket });

    while (currentPacket.ttl > 0 && currentPacket.hops < 5) {
      // Simulate delay 1-3 seconds
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await new Promise(res => setTimeout(res, delay));
      
      currentPacket.ttl -= 1;
      currentPacket.hops += 1;
      
      const nextPeer = peers.find(p => !usedPeers.includes(p)) || 'Unknown Device';
      usedPeers.push(nextPeer);

      this._notify({ 
        type: 'HOP', 
        packet: currentPacket, 
        peer: nextPeer,
        toast: `Relayed via ${nextPeer}`
      });
    }

    this._notify({ type: 'ACK', packet: currentPacket, toast: `Acknowledged by Mesh Network` });
    this.isSimulating = false;
    return currentPacket;
  }
}

export const meshSimulator = new MeshSimulator();
