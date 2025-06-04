import { createContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import Peer from 'peerjs';

export const ScreenShareContext = createContext();

export function ScreenShareProvider({ children, auth }) {
    const [streams, setStreams] = useState(() => {
        // Ambil data dari localStorage saat aplikasi dimuat
        const storedData = localStorage.getItem('screenShareStreams');
        return storedData ? JSON.parse(storedData) : [];
    });

    const [peer, setPeer] = useState(null);
    
    // Jika bukan guru, return children langsung tanpa inisialisasi
    if (auth?.user?.role_id !== 1) {
        return <>{children}</>;
    }

    // Simpan data ke localStorage setiap kali streams berubah
    useEffect(() => {
        localStorage.setItem('screenShareStreams', JSON.stringify(streams));
    }, [streams]);

    // Inisialisasi PeerJS di level global
    useEffect(() => {
        const teacherPeer = new Peer();
        
        teacherPeer.on("open", (id) => {
            setPeer(teacherPeer);
        });

        teacherPeer.on("error", (err) => {
            console.error("PeerJS error:", err);
        });

        return () => {
            if (teacherPeer) teacherPeer.destroy();
        };
    }, []);

    // Inisialisasi Pusher di level global
    useEffect(() => {
        const pusher = new Pusher("850300e98d76a0db2c51", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe("test-monitoring");

        channel.bind("screen-share-started", (data) => {

            if (!data.peerId || !data.name) {
                removeStream(data.studentId);
            } else {
                addOrUpdateStream({
                    studentId: data.studentId,
                    peerId: data.peerId,
                    name: data.name,
                    from: data.from,
                });
            }
        });

        return () => {
            pusher.unsubscribe("test-monitoring");
        };
    }, []);

    const addOrUpdateStream = (data) => {
        setStreams((prev) => {
            const existingIndex = prev.findIndex(
                (stream) => stream.studentId === data.studentId
            );

            if (existingIndex !== -1) {
                const updatedStreams = [...prev];
                updatedStreams[existingIndex] = data;
                return updatedStreams;
            } else {
                return [...prev, data];
            }
        });
    };

    const removeStream = (studentId) => {
        setStreams((prev) => prev.filter((stream) => stream.studentId !== studentId));
    };

    return (
        <ScreenShareContext.Provider value={{ streams, addOrUpdateStream, removeStream, peer }}>
            {children}
        </ScreenShareContext.Provider>
    );
}
