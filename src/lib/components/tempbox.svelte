<script>
	import { parseISO, format } from 'date-fns';
	let { temp } = $props();
	const temperature = $derived.by(() => {
		if (temp.length > 0) {
			return (temp[0].temp / 100).toFixed(2);
		} else {
			return 0;
		}
	});
	let color = $state();
	const date = $derived(format(parseISO(temp[0].time), 'yyyy-MM-dd HH:mm'));
</script>

<div class="tempbox">
	<section class="temp">
		<span class="tempbg">
			<span class="dark">Temp:</span> <span style:color>{temperature}°C</span>
		</span>
	</section>
	<section class="time">
		<span class="timebg">
			<span class="dark">Time:</span> <span>{date}</span>
		</span>
	</section>
</div>

<style>
	.dark {
		color: rgb(90, 90, 90);
	}
	.tempbox {
		/* margin: auto; */
		/* margin-left: center; */
		background-color: #222222;
		/* padding: 20px 75px 20px 75px; */
		border-radius: 15px;
		vertical-align: bottom;
		width: 220px;
		margin-top: 80px;
		margin-bottom: 5px;
		height: 120px;
	}
	.temp {
		font-size: 26px;
		text-align: center;
		padding-top: 30px;
		color: var(--temp-color);
		width: 100%;
	}
	.tempbg {
		background-color: #222222;
	}
	.time {
		padding-top: 10px;
		font-size: 14px;
		text-align: center;
		color: gray;
	}
	.timebg {
		background-color: #222222;
	}
</style>
