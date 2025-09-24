import SITE_URL from "../../site";
import DashboardHeader from "../DashboardHeader";
import VideoPlayer from "../VideoPlayer";

const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    sources: [
        {
            src: `${SITE_URL}/media/live/index.m3u8`,
            type: 'application/x-mpegurl'
        }
    ],
};

function DashboardView() {
    return (
        <main>
            <DashboardHeader />
            <section>
                <VideoPlayer options={videoJsOptions} />
            </section>
        </main>
    );
}

export default DashboardView;