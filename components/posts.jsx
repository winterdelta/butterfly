import Image from "next/image";
import styles from "../styles/posts.module.css";
import { useRef, useState, useEffect } from "react";
import { PlayFilledAlt, PauseFilled } from "@carbon/icons-react";
import useSWR from "swr";

const fetcher = async (input, init, ...args) => {
	const res = await fetch(input, init);
	return res.json();
};

export default function Posts () {
	const [playing, setPlaying] = useState(false);

	const audioPlayer = useRef(null);

	const [trackPlaying, setTrackPlaying] = useState("");

	const { data } = useSWR("/api/posts", fetcher, { refreshInterval: 1 });

	useEffect(() => {
		if (playing) {
			audioPlayer.current.play();
		} else {
			audioPlayer.current.pause();
		}
	}, [playing, trackPlaying, audioPlayer]);

	return (
		<div className={styles.posts}>
			{/* {data
				? data.map((d: any, index: any) => (
						<div key={index}>{d.data.datetime}</div>
				  ))
				: null} */}

			{/* {!data ? <div>loading...</div> : <div>DATA LOADED</div>} */}

			{data
				? data?.map((d, index) => (
					<div
						// style={{backgroundImage: `url("${d.data.image}")`,}}
						className={styles.post}
						key={index}
					>
						{/* <div className={styles.frostedLayer}> */}
						<div
							style={{ backgroundImage: `url("${d.data?.image}")` }}
							className={styles.imageContainer}
						>
							{/* <Image
									className={styles.image}
									style={{ objectFit: "cover" }}
									alt=''
									src={`/${d.data?.image}`}
									fill={true}
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/> */}
						</div>
						<div className={styles.playBtn}>
							{playing && trackPlaying === d.data?.audio ? (
								<button
									className={styles.button}
									onClick={() => {
										setPlaying(false);
									}}
								>
									<PauseFilled size='16' />
								</button>
							) : (
								<button
									className={styles.button}
									onClick={() => {
										setTrackPlaying(d.data?.audio);
										setPlaying(true);
									}}
								>
									<PlayFilledAlt size='16' />
								</button>
							)}
						</div>
						<div className={styles.dateTime}>

							{new Date(d.data?.datetime).toString()}

						</div>
						<div className={styles.textContainer}>
							<div className={styles.text}>

								{d.data?.transcript}

							</div>
						</div>
						{/* </div> */}
					</div>
				))
				: null}
			<div
				// style={{backgroundImage: `url("/cat.png")`,}}
				className={styles.post}
			>
				{/* <div className={styles.frostedLayer}> */}
				<div className={styles.imageContainer}>
					<Image
						className={styles.image}
						style={{ objectFit: "cover" }}
						alt=''
						src='/krewella.jpg'
						fill={true}
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</div>
				<div className={styles.playBtn}>
					{playing &&
						trackPlaying ===
						"http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" ? (
						<button
							className={styles.button}
							onClick={() => {
								setPlaying(false);
							}}
						>
							<PauseFilled size='16' />
						</button>
					) : (
						<button
							className={styles.button}
							onClick={() => {
								setTrackPlaying(
									"http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"
								);
								setPlaying(true);
							}}
						>
							<PlayFilledAlt size='16' />
						</button>
					)}
				</div>
				<div className={styles.dateTime}>
					21:53 5 Nov 2022
				</div>
				<div className={styles.textContainer}>
					<div className={styles.text}>
						1MIN to go and counting.
					</div>
				</div>
				{/* </div> */}
			</div>
			<audio
				// onLoadedMetadata={onLoadedMetadata}
				// preload='auto'
				ref={audioPlayer}
				src={trackPlaying}
			// onEnded={playNextTrack}
			/>
		</div>
	);
}
