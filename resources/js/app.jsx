import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ActivityProvider } from "./Contexts/ActivityContext";
import { ScreenShareProvider } from "./Contexts/ScreenShareContext";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ActivityProvider auth={props.initialPage.props.auth}>
                <ScreenShareProvider auth={props.initialPage.props.auth}>
                    <App {...props} />
                </ScreenShareProvider>
            </ActivityProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
