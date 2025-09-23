from typing import Tuple, List
from typing import Tuple, List, Optional
import numpy as np

try:
    from qiskit import QuantumCircuit, Aer, execute
    from qiskit.providers.aer import AerSimulator
except Exception:
    QuantumCircuit = None  
    Aer = None  
    execute = None  


def _random_bits(n: int) -> List[int]:
    return [1 if np.random.rand() > 0.5 else 0 for _ in range(n)]


def generate_bb84_key(num_bits: int = 128, with_eve: bool = False):
    """
    Full BB84 simulation (sender/receiver). If Qiskit is available, use AerSimulator to
    prepare qubits in sender bases and measure in receiver bases. Optionally simulate an eavesdropper
    who intercepts and measures in random bases.

    Returns (sender_bits, sender_bases, shared_key_bits)
    """
    sender_bits = _random_bits(num_bits)
    sender_bases = _random_bits(num_bits)  # 0 = Z, 1 = X
    receiver_bases = _random_bits(num_bits)

    # If Qiskit not available, fallback to simulated measurement model
    if QuantumCircuit is None:
        # measurement result equals bit if bases match, else random
        measured = []
        for s_bit, s_base, r_base in zip(sender_bits, sender_bases, receiver_bases):
            if s_base == r_base:
                measured.append(s_bit)
            else:
                measured.append(1 if np.random.rand() > 0.5 else 0)

        # apply eavesdropper: if with_eve, randomly flip some measured bits where eve measured in different base
        if with_eve:
            eve_bases = _random_bits(num_bits)
            for i in range(num_bits):
                if eve_bases[i] != sender_bases[i]:
                    # measuring in wrong basis may flip the bit
                    if np.random.rand() > 0.5:
                        measured[i] = 1 - measured[i]

        # derive shared key where bases match
        key_bits = ''.join(str(measured[i]) for i in range(num_bits) if sender_bases[i] == receiver_bases[i])
        kept = [i for i in range(num_bits) if sender_bases[i] == receiver_bases[i]]
        return {
            'sender_bits': ''.join(str(b) for b in sender_bits),
            'sender_bases': ''.join(str(b) for b in sender_bases),
            'receiver_bases': ''.join(str(b) for b in receiver_bases),
            'kept_positions': kept,
            'shared_key': key_bits,
            'eve_bases': ''.join(str(b) for b in _random_bits(num_bits)) if with_eve else None,
        }

    # Qiskit path: construct circuits per qubit and measure
    simulator = AerSimulator()
    measured = []
    for i in range(num_bits):
        qc = QuantumCircuit(1, 1)
        b = sender_bits[i]
        base = sender_bases[i]
        # prepare
        if base == 0:
            if b == 1:
                qc.x(0)
        else:
            # X-basis: prepare |+> or |->
            if b == 0:
                qc.h(0)
            else:
                qc.x(0)
                qc.h(0)

        # optional eavesdropper
        if with_eve:
            eve_base = 1 if np.random.rand() > 0.5 else 0
            if eve_base == 1:
                qc.h(0)
            qc.measure_all()
            # execute
            job = simulator.run(qc, shots=1)
            result = job.result()
            counts = result.get_counts()
            measured_bit = int(list(counts.keys())[0])
            # after eavesdropper measurement, qubit collapses; need to reprepare into measured state
            qc = QuantumCircuit(1, 1)
            if measured_bit == 1:
                qc.x(0)

        # receiver measurement in chosen basis
        if receiver_bases[i] == 1:
            qc.h(0)
        qc.measure_all()
        job = simulator.run(qc, shots=1)
        result = job.result()
        counts = result.get_counts()
        measured_bit = int(list(counts.keys())[0])
        measured.append(measured_bit)

    key_bits = ''.join(str(measured[i]) for i in range(num_bits) if sender_bases[i] == receiver_bases[i])
    kept = [i for i in range(num_bits) if sender_bases[i] == receiver_bases[i]]
    return {
        'sender_bits': ''.join(str(b) for b in sender_bits),
        'sender_bases': ''.join(str(b) for b in sender_bases),
        'receiver_bases': ''.join(str(b) for b in receiver_bases),
        'kept_positions': kept,
        'shared_key': key_bits,
        'eve_bases': None,
    }


def bits_to_bytes(bits: str, out_len: int) -> bytes:
    if len(bits) == 0:
        return bytes([0] * out_len)
    out = bytearray()
    for b in range(out_len):
        byte = 0
        for i in range(8):
            idx = (b * 8 + i) % len(bits)
            bit_val = 1 if bits[idx] == '1' else 0
            byte = (byte << 1) | bit_val
        out.append(byte)
    return bytes(out)


def xor_encrypt(plain: bytes, key_bits: str) -> bytes:
    key_bytes = bits_to_bytes(key_bits, len(plain))
    return bytes([p ^ k for p, k in zip(plain, key_bytes)])


def xor_decrypt(cipher: bytes, key_bits: str) -> bytes:
    return xor_encrypt(cipher, key_bits)
