import Spinner from "@/components/Spinner";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";
import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrackPreview from '../components/TrackPreview';
import { db } from "../firebase";
import Compact from "@uiw/react-color-compact";

const backgrounds = [
    {
        backgroundImage: `url("/tortoise-shell.svg")`,
        path: "/tortoise-shell.svg",
        theme: "dark"
    },
    // {
    //     path: '/default_bg.svg',
    //     theme: "dark"
    // },
    {
        backgroundImage: `url("/hhholographic.webp")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        path: "/hhholographic.webp",
        theme: "light"
    },
    {
        backgroundImage: `url("/grain.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        path: "/grain.svg",
        theme: "light"
    },
    {
        backgroundImage: `url("/rainbow-vortex.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        path: "/rainbow-vortex.svg",
        theme: "dark"
    },
    //DEBATABLE 
    {
        backgroundImage: `url("/sun-tornado_2.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        path: "/sun-tornado_2.svg",
        theme: "dark"
    },
    {
        backgroundImage: `url("/sssquiggly.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        path: "/sssquiggly.svg",
        theme: "dark"
    },
    {
        backgroundImage: `url("/big wavy peak zoomed.svg")`,
        path: '/orange_wavy_preview.png',
        theme: "dark",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
    {
        backgroundImage: `url("/black_vector.svg")`,
        path: '/black_vector.svg',
        theme: "dark",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
    {
        backgroundImage: `url("/pink stacked wavey.svg")`,
        path: '/pink_wavey_preview.png',
        theme: "dark",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
    {
        backgroundImage: `url("/polygon_purple.svg")`,
        path: '/polygon_purple_preview.png',
        theme: "dark",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
    {
        backgroundImage: `url("/stacked-waves-haikei.svg")`,
        path: '/stacked-waves-haikei_preview.png',
        theme: "light",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
]

const Tracks = ({ }) => {
    const [tracks, setTracks] = useState();
    const [users, setUsers] = useState(null)
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession()
    const [selectedBackground, setSelectedBackground] = useState({
        backgroundImage: `url("/tortoise-shell.svg")`,
        path: "/tortoise-shell.svg",
        theme: "dark"
    })
    const router = useRouter()
    const time_range = router.query.time_range
    const [timeRange, setTimeRange] = useState(time_range);
    const [color, setcolor] = useState('#fff')
    const [showcolorpicker, setshowcolorpicker] = useState(false)

    const handleItemClick = (bg) => {
        setSelectedBackground(bg);
    };

    const handleColorChange = (updatedColor) => {
        setcolor(updatedColor.hex);
        setSelectedBackground({
            backgroundImage: "",
            backgroundColor: updatedColor.hex,
        });
    };

    const Gradients = () => {
        return (<>
            <div className='w-full flex justify-center'>
                <ul data-html2canvas-ignore="true" className="px-10 flex items-start mb-8 space-x-3 overflow-y-hidden overflow-x-scroll no-scrollbar" >
                    {users && users.images && users.images.length > 0 && (<>
                        <li className="bg-black rounded-full px-2.5  border-2 border-white" key={"user"}>
                            <label htmlFor="upload-button" className="text-center text-5xl rounded-full cursor-pointer">
                                +
                            </label>
                            <input id="upload-button" htmlFor="upload-button" type="file" accept=".jpg, .png, .jpeg, .svg" style={{ display: "none" }} onChange={handleUpload} className={`p-0.5 rounded-full bg-white cursor-pointer h-12 w-12`} />

                        </li>
                        <li className=" rounded-full px-2.5 border-2 border-white relative">
                            <button onClick={() => setshowcolorpicker(showcolorpicker => !showcolorpicker)}>
                                {showcolorpicker ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 20" strokeWidth={1.5} stroke="currentColor" className="w-7 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 20" strokeWidth={1.5} stroke="currentColor" className="w-7 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
                                    </svg>
                                )
                                }
                            </button>
                        </li>
                        {showcolorpicker && (
                            <div className="absolute mt-14 z-10">
                                <Compact
                                    color={color}
                                    placement="Top"
                                    onChange={handleColorChange}
                                    style={{
                                        boxShadow: 'rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px',
                                    }}
                                />
                            </div>
                        )}
                    </>
                    )}
                    {backgrounds.map((bg, index) => (<>
                        <li className="mr-2 flex-shrink-0" key={index}>
                            <Image alt='Bg preview Image' className={`p-0.5 rounded-full bg-white cursor-pointer`} src={bg.path} width={50} height={50} onClick={() => handleItemClick(bg)} />
                        </li>
                    </>
                    ))}
                </ul>
            </div>

        </>
        )
    }

    async function getTopTracks(time) {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time}&limit=100`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        })
        const data = await response.json()
        let finalAlbumsObject = {};
        if (data.items) {
            data.items.map((item) => {
                if (item?.album && item?.album?.images && item?.album?.images[0]) {
                    finalAlbumsObject[item?.album?.id] = {
                        image: item?.album?.images[0]?.url,
                        href: item?.external_urls?.spotify
                    }
                }
            })
        }
        // console.log("user tracks data", finalAlbumsObject)
        return finalAlbumsObject
    }

    async function getuserprofile() {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        })
        const data = await response.json()
        return data
    }

    useEffect(() => {
        setIsLoading(true)
        const f = async () => {
            if (session) {
                setTracks(await getTopTracks(timeRange))
                setUsers(await getuserprofile())
                setIsLoading(false)
            }
            else {
                if (router.isReady) {
                    router.push('/')
                }
            }
        }
        f();
    }, [session, timeRange])

    useEffect(() => {
        if (router.isReady) {
            setTimeRange(time_range)
        }
    }, [time_range])

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    const shareclickCountRef = db.collection('share_clicks').doc('clickCount');
    const incrementShareCount = async () => {
        try {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(shareclickCountRef);

                if (!doc.exists) {
                    transaction.set(shareclickCountRef, { share_count: 1 });
                } else {
                    const newCount = doc.data().share_count + 1;
                    transaction.update(shareclickCountRef, { share_count: newCount });
                }
            });

            console.log("Share count incremented successfully!");
        } catch (error) {
            console.error("Error incrementing share count:", error);
        }
    };
    const downloadclickCountRef = db.collection('download_clicks').doc('clickCount');
    const incrementDownloadCount = async () => {
        try {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(downloadclickCountRef);

                if (!doc.exists) {
                    transaction.set(downloadclickCountRef, { download_count: 1 });
                } else {
                    const newCount = doc.data().download_count + 1;
                    transaction.update(downloadclickCountRef, { download_count: newCount });
                }
            });

            console.log("Share count incremented successfully!");
        } catch (error) {
            console.error("Error incrementing share count:", error);
        }
    };
    const handleShare = async () => {
        incrementShareCount();
        const container = document.getElementById("my-container");
        html2canvas(container, {
            imageTimeout: 50000,
            scale: 2,
        }).then(canvas => {
            const id = Date.now()
            canvas.toBlob(async (blob) => {
                const filesArray = [
                    new File(
                        [blob],
                        `the_wall_${id}.jpg`,
                        {
                            type: "image/jpeg",
                            lastModified: new Date().getTime()
                        }
                    )
                ];
                const shareData = {
                    files: filesArray,
                };

                if (navigator.share) {
                    try {
                        await navigator
                            .share(shareData)
                            .then(() =>
                                console.log("Hooray! Your content was shared to the world")
                            );
                    } catch (error) {
                        console.log(`Oops! I couldn't share to the world because: ${error}`);
                    }
                } else {
                    console.log(
                        "Web share is currently not supported on this browser. Please provide a callback"
                    );
                }
            });
        });
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSelectedBackground({
                ...selectedBackground,
                backgroundImage: `url("${reader.result}")`,
                theme: "dark",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            });
        }

        reader.readAsDataURL(file);
    }

    const handleDownload = debounce(() => {
        incrementDownloadCount();
        const container = document.getElementById("my-container");
        const totalSteps = 100;
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(interval);
                html2canvas(container, {
                    imageTimeout: 50000,
                    scale: 2,
                }).then(canvas => {
                    const id = Date.now();
                    canvas.toBlob(blob => saveAs(blob, `the_wall_${id}.png`));
                });
            } else {
                setDownloadProgress(prev => prev + 1);
            }
            currentStep += 1;
        }, 30);

        setTimeout(() => {
            setDownloadProgress(0);
        }, totalSteps * 70);
    }, 3000);

    const contextClass = {
        success: "bg-blue-600",
        error: "bg-red-600",
        info: "bg-gray-600",
        warning: "bg-orange-400",
        default: "bg-indigo-600",
        dark: "bg-white-600 font-gray-300",
    };

    return (
        <div className="h-full">
            <Head>
                <title>{users ? `${users.display_name}'s wall` : 'THE WALLS'}</title>
                <meta name="description" content="Get your most played tracks from Spotify." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ToastContainer toastClassName={({ type }) => contextClass[type || "default"] +
                "bg-transparent"
            }
                bodyClassName={() => "w-[60%] md:w-[80%] mt-[55%] md:mt-[60%] ml-2 rounded-lg text-lg text-black font-extrabold block p-3 text-sm bg-white"}
            />
            <div style={selectedBackground} id='my-container' className="py-16 flex flex-col items-center justify-center w-full h-full">
                <ul data-html2canvas-ignore="true" className="flex flex-wrap text-xs sm:font-medium text-center mb-5 justify-center mt-5">
                    <li className="mr-2">
                        <div className={`inline-block px-2 py-2 rounded-lg transition delay-300 backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-xl cursor-pointer ${selectedBackground.theme == 'light' && "text-black"} ${timeRange == "short_term" && " border-[1px] border-white-400"}`} aria-current="page" onClick={() => {
                            router.push('/tracks?time_range=short_term')
                        }}>Last Month</div>
                    </li>
                    <li className="mr-2">
                        <div className={`inline-block px-2 py-2 rounded-lg transition delay-300 backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-xl cursor-pointer ${selectedBackground.theme == 'light' && "text-black"} ${timeRange == "medium_term" && " border-[1px] border-white-400"}`} onClick={() => {
                            router.push('/tracks?time_range=medium_term')
                        }}>Last 6 Months</div>
                    </li>
                    <li className="mr-2">
                        <div className={`inline-block px-2 py-2 rounded-lg transition delay-300 backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-xl cursor-pointer ${selectedBackground.theme == 'light' && "text-black"} ${timeRange == "long_term" && " border-[1px] border-white-400"}`} onClick={() => {
                            router.push('/tracks?time_range=long_term')
                        }}>All Time</div>
                    </li>
                </ul>
                <Gradients />
                {isLoading ? (<div className="h-[40rem]">
                    <div className="mt-5">
                        <Spinner />
                    </div>
                </div>) : (
                    <div className='w-full min-h-[40rem]'>
                        <div className="w-full flex flex-row justify-center items-center">
                            <div style={{
                                width: "fit-content",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "fit-content",
                            }} className='py-5'>
                                {users && users.images && users.images.length > 0 && (
                                    <>
                                        <div className='w-14 h-35 md:w-20'>
                                            <Image priority={true} layout="responsive"
                                                height={200} width={200} src={users.images[users.images.length - 1].url} alt="Profile phot" className="mx-auto rounded-full dark:bg-gray-500 aspect-square shadow-md" />
                                        </div>
                                        <div className='flex flex-col justify-center items-center mt-2'>
                                            <p className={`text-lg lowercase font-bold md:text-2xl ${selectedBackground.theme == 'light' && "text-black"}`}>{users ? (`${users.display_name}'s wall`) : 'Loading...'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-row flex-wrap h-full w-full justify-center overflow-visible px-7'>
                            {tracks && Object.keys(tracks).slice(0, 15).map((track) => (
                                <Link className="w-[25%] sm:w-[20%] lg:w-[15%] xl:w-[15%] 2xl-[15%] overflow-hidden m-1.5 hover:cursor-pointer" key={track} href={tracks[track]?.href} target="_blank">
                                    <TrackPreview track={tracks[track]} />
                                </Link>
                            ))}
                        </div>
                        <div className="w-full flex flex-col justify-center items-center my-4" >
                            <p className={`mb-0 font-semibold italic ${selectedBackground.theme == 'light' && "text-black"}`} >thewalls.vercel.app</p>
                            <div className="mb-1 mt-4 w-20 h-5 md:w-40 md:h-10">
                                <Image alt='spotify logo' layout="responsive" src={selectedBackground.theme == 'light' ? `/spotify_logo_dark.png` : `/spotify_logo.png`} width={100} height={10} />
                            </div>
                        </div>
                    </div>
                )}
                <div className='flex flex-row mt-10' data-html2canvas-ignore="true">
                    <button
                        onClick={() => {
                            debounce(handleShare(), 3000)
                        }}
                        type="button"
                        className="flex items-center justify-center mr-2"
                    >
                        <div className={`inline-block px-2 py-2 w-28 rounded-lg transition delay-300 backdrop-filter backdrop-blur-lg bg-opacity-40 shadow-xl cursor-pointer border-[1px] border-white-400 ${selectedBackground.theme == 'light' && "text-black"}  `} >Share</div>
                    </button>
                    <button
                        onClick={() => {
                            handleDownload()
                        }}
                        type="button"
                        className="flex items-center justify-center"
                    >
                        <div className={`inline-block px-2 py-2 w-40 rounded-lg transition delay-300 backdrop-filter backdrop-blur-lg bg-opacity-40 shadow-xl cursor-pointer border-[1px] border-white-400 ${selectedBackground.theme == 'light' && "text-black"}  `} > {downloadProgress > 0 ? `Downloading...` : 'Download'}</div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Tracks