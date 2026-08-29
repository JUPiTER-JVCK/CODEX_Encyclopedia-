---
title: "Industrial Protocols — Interactive Labs"
layer: 19_Industrial_Protocols
section: lessons
tags: [lesson, industrial, modbus, opcua, can, mqtt, lab, quiz, hands-on]
updated: 2026-05-21
---

# Industrial Protocols — Interactive Labs

---

## Module 1: Modbus TCP Read/Write

### Objective

Query a Modbus TCP slave using pymodbus, read holding registers,
write coils, and understand the Modbus PDU structure.

### Prerequisites

```bash
pip install pymodbus
# Or test against a public Modbus server:
# modscan64, or run a local slave: pymodbus.server
```

### Lab Steps

1. Start a local Modbus TCP slave (for testing):
```python
# server.py — run in a separate terminal
from pymodbus.server import StartTcpServer
from pymodbus.datastore import (ModbusSequentialDataBlock,
                                 ModbusSlaveContext, ModbusServerContext)

store = ModbusSlaveContext(
    di=ModbusSequentialDataBlock(0, [0]*100),   # Discrete inputs
    co=ModbusSequentialDataBlock(0, [0]*100),   # Coils
    hr=ModbusSequentialDataBlock(0, list(range(100))),  # Holding registers
    ir=ModbusSequentialDataBlock(0, [1234]*100) # Input registers
)
context = ModbusServerContext(slaves=store, single=True)
StartTcpServer(context, address=("127.0.0.1", 502))
```

2. Read holding registers (FC 03):
```python
# client.py
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient('127.0.0.1', port=502)
client.connect()

# Read 10 holding registers starting at address 0
result = client.read_holding_registers(address=0, count=10, slave=1)
if not result.isError():
    print(f"Holding registers [0-9]: {result.registers}")
else:
    print(f"Error: {result}")
```

3. Write coils and verify (FC 01/05):
```python
# Write coil 0 = True (FC 05: Write Single Coil)
result = client.write_coil(address=0, value=True, slave=1)
print(f"Write coil: {'OK' if not result.isError() else result}")

# Write multiple coils (FC 15)
result = client.write_coils(address=0, values=[True, False, True, True], slave=1)
print(f"Write coils: {'OK' if not result.isError() else result}")

# Read back coils (FC 01)
result = client.read_coils(address=0, count=4, slave=1)
if not result.isError():
    print(f"Coils [0-3]: {result.bits[:4]}")

client.close()
```

4. Inspect raw Modbus PDU:
```
  Modbus TCP Application Data Unit (ADU):
  ┌────────────────────────────────────────────────────────┐
  │ MBAP Header (7 bytes)              │ PDU               │
  ├──────────┬──────────┬───────┬──────┼────────┬──────────┤
  │Trans ID  │Proto ID  │Length │Unit  │Func    │Data      │
  │(2 bytes) │(2 bytes) │(2)    │(1)   │Code(1) │(variable)│
  │ 0x0001   │ 0x0000   │ 0x0006│ 0x01 │ 0x03   │ 0x00 0x00│
  │          │(always 0)│       │slave │Read    │addr=0    │
  │          │          │       │ID    │Hold Reg│count=10  │
  └──────────┴──────────┴───────┴──────┴────────┴──────────┘
  
  Function codes:
  0x01 Read Coils         0x05 Write Single Coil
  0x02 Read Discrete In.  0x0F Write Multiple Coils
  0x03 Read Holding Reg.  0x06 Write Single Register
  0x04 Read Input Reg.    0x10 Write Multiple Registers
```

### Knowledge Check

**Q1**: What is the difference between holding registers and input registers in Modbus?

> **A1**: Holding registers (FC 03) are read-write — the master can both
> read and write them. They typically hold setpoints, configuration values,
> or control parameters. Input registers (FC 04) are read-only from the
> master's perspective — they hold sensor readings or process values
> that only the slave device itself updates.

**Q2**: Why is Modbus TCP considered insecure for untrusted networks?

> **A2**: Modbus has no authentication, no encryption, and no authorization.
> Any device that can reach port 502 can read all registers and write
> arbitrary values to coils/registers — potentially controlling industrial
> equipment. Modbus should be isolated on dedicated industrial networks
> or wrapped in a VPN/TLS tunnel.

---

## Module 2: OPC UA Node Browse

### Objective

Connect to an OPC UA server, browse the address space, read node
values, and subscribe to data changes.

### Prerequisites

```bash
pip install asyncua
```

### Lab Steps

1. Start a test OPC UA server:
```python
# opcua_server.py
import asyncio
from asyncua import Server

async def main():
    server = Server()
    await server.init()
    server.set_endpoint("opc.tcp://0.0.0.0:4840/freeopcua/server/")

    uri = "http://examples.freeopcua.github.io"
    idx = await server.register_namespace(uri)

    # Add an object with variables
    objects = server.nodes.objects
    myobj = await objects.add_object(idx, "MyDevice")
    temp = await myobj.add_variable(idx, "Temperature", 23.5)
    setpoint = await myobj.add_variable(idx, "Setpoint", 25.0)
    await setpoint.set_writable()

    async with server:
        count = 0
        while True:
            await asyncio.sleep(1)
            count += 1
            await temp.set_value(23.5 + (count % 5) * 0.1)
            print(f"Updated Temperature: {23.5 + (count % 5) * 0.1:.1f}°C")

asyncio.run(main())
```

2. Browse and read:
```python
# opcua_client.py
import asyncio
from asyncua import Client

async def main():
    async with Client(url="opc.tcp://localhost:4840/freeopcua/server/") as client:
        # Get server info
        print(f"Namespaces: {await client.get_namespace_array()}")

        # Browse objects folder
        objects = client.nodes.objects
        children = await objects.get_children()
        for child in children:
            name = await child.read_browse_name()
            print(f"Object: {name.Name}")

        # Read a specific node by path
        node = await client.nodes.root.get_child([
            "0:Objects", "2:MyDevice", "2:Temperature"
        ])
        value = await node.read_value()
        print(f"Temperature: {value}°C")

        # Write setpoint
        setpoint = await client.nodes.root.get_child([
            "0:Objects", "2:MyDevice", "2:Setpoint"
        ])
        await setpoint.write_value(26.0)
        print("Setpoint updated to 26.0°C")

asyncio.run(main())
```

3. Subscribe to data changes:
```python
from asyncua import Client
from asyncua.common.subscription import SubHandler

class MyHandler(SubHandler):
    def datachange_notification(self, node, val, data):
        print(f"DataChange: {node} → {val}")

async def subscribe():
    async with Client("opc.tcp://localhost:4840/freeopcua/server/") as client:
        handler = MyHandler()
        sub = await client.create_subscription(period=500, handler=handler)

        node = await client.nodes.root.get_child([
            "0:Objects", "2:MyDevice", "2:Temperature"
        ])
        await sub.subscribe_data_change(node)

        await asyncio.sleep(10)  # Receive changes for 10 seconds

asyncio.run(subscribe())
```

---

## Module 3: CAN Bus Monitor and MQTT Pub/Sub

### Objective

Monitor CAN frames with SocketCAN, decode a simple message, then
publish data to an MQTT broker and subscribe from another client.

### Lab Steps

1. Set up virtual CAN interface:
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set vcan0 up
ip link show vcan0
```

2. Send and capture CAN frames:
```bash
# Terminal 1: listen
candump vcan0

# Terminal 2: send a frame
# cansend <interface> <ID>#<data>
cansend vcan0 123#DEADBEEF01020304
# ID=0x123, 8 bytes of data

# Send with extended ID (29-bit):
cansend vcan0 1FFFFFFF#1122334455667788

# candump output:
#   vcan0  123   [8]  DE AD BE EF 01 02 03 04
```

3. Decode a CAN frame manually:
```python
import can  # pip install python-can

def decode_engine_rpm(frame):
    """Example: engine RPM in bytes 2-3, scaled by 0.25 RPM/bit."""
    if frame.arbitration_id == 0x0C9:  # Common OBD-II RPM PID
        raw = (frame.data[2] << 8) | frame.data[3]
        rpm = raw * 0.25
        return rpm
    return None

bus = can.Bus(interface='socketcan', channel='vcan0', bitrate=500000)

# Send a fake RPM frame
frame = can.Message(arbitration_id=0x0C9,
                    data=[0x04, 0x41, 0x0C, 0x1A, 0xF8, 0x00, 0x00, 0x00],
                    is_extended_id=False)
bus.send(frame)

# Receive and decode
msg = bus.recv(timeout=1.0)
if msg:
    rpm = decode_engine_rpm(msg)
    print(f"Engine RPM: {rpm}")
```

4. MQTT publish and subscribe:
```bash
# Install Mosquitto broker
sudo apt install mosquitto mosquitto-clients
sudo systemctl start mosquitto

# Subscribe in one terminal
mosquitto_sub -h localhost -t "factory/line1/temperature" -v

# Publish in another terminal
mosquitto_pub -h localhost -t "factory/line1/temperature" -m '{"value": 23.5, "unit": "C"}'
```

```python
# Python MQTT with paho-mqtt
import paho.mqtt.client as mqtt
import json, time

def on_message(client, userdata, message):
    payload = json.loads(message.payload)
    print(f"[{message.topic}] {payload}")

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("factory/+/temperature")  # Wildcard + matches one level
client.loop_start()

# Publish readings
for i in range(5):
    payload = json.dumps({"value": 23.5 + i * 0.1, "unit": "C"})
    client.publish("factory/line1/temperature", payload, qos=1)
    time.sleep(1)

client.loop_stop()
```

```
  MQTT topic hierarchy:
  
  factory/
  ├── line1/
  │   ├── temperature      ← sensor readings
  │   ├── pressure
  │   └── status
  ├── line2/
  │   └── temperature
  └── alerts/
      └── critical         ← alarm events
  
  Wildcards:
  + = single level (factory/+/temperature matches line1 and line2)
  # = multi-level (factory/# matches everything under factory/)
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Modbus | Simple polling protocol: master requests, slave responds |
| Function code | Modbus 1-byte opcode specifying operation (read/write) |
| OPC UA | Unified Architecture — platform-neutral IIoT standard with security |
| Address space | OPC UA tree of nodes (objects, variables, methods) |
| Subscription | OPC UA: server pushes value changes to client (event-driven) |
| CAN | Controller Area Network — 2-wire differential bus, up to 1 Mbps |
| Arbitration | CAN: lower ID wins bus contention (dominant bit = 0) |
| SocketCAN | Linux kernel CAN subsystem — standard network interface |
| MQTT | Publish-subscribe over TCP, QoS 0/1/2, retained messages |
| Broker | MQTT server (Mosquitto, HiveMQ) — routes messages by topic |

### Challenge

> Build an IIoT gateway: read Modbus TCP holding registers from a
> simulated PLC every second, format readings as JSON, publish to
> an MQTT broker. Subscribe from a second Python process and write
> values to an OPC UA server. Add a simple anomaly alert: publish
> to `factory/alerts/critical` when any value exceeds a threshold.

---

## Cross-links

- Industrial protocols → [../protocols/INDEX.md](../protocols/INDEX.md)
- Modbus protocol → [../protocols/modbus.md](../protocols/modbus.md)
- OPC UA protocol → [../protocols/opc_ua.md](../protocols/opc_ua.md)
- MQTT (Application layer) → [../../Network/13_Network_Application/man_pages/app_protocol_tools.md](../../Network/13_Network_Application/man_pages/app_protocol_tools.md)
- Embedded systems labs → [../../18_Embedded_Systems/lessons/embedded_labs.md](../../18_Embedded_Systems/lessons/embedded_labs.md)
