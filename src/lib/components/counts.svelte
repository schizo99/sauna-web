<script>
	let { starts } = $props();
	import { parseISO, format } from 'date-fns';
	const count = $derived(starts.length);
	const first = $derived(format(parseISO(starts[0].time), 'yyyy-MM-dd'));
	const last = $derived(format(parseISO(starts[starts.length - 1].time), 'yyyy-MM-dd'));
</script>

<div class="counts">
	<section class="first">
		<span class="firstbg">
				<span class="count">Count:</span> <span class="countnr">{count}</span>
				<br />
				<span class="start">First start:</span>
				<span>{first}</span>
				<br />
				<span class="start">Last start:</span>
				<span>{last}</span>
		</span>
	</section>
</div>

<style>
    .counts {
		margin-top: 5px;
		background-color: #222222;
		/* padding: 10px 75px 25px 75px; */
		border-radius: 15px;
		vertical-align: bottom;
		height: 120px;
		width: 220px;
	}
	.first {
		padding-top: 25px;
		font-size: 14px;
		text-align: center;
		color: gray;
	}
	.start {
		color: rgb(90, 90, 90);
	}
	.count {
		font-size: 26px;
	}
	.countnr {
		font-size: 26px;
		color: whitesmoke;
	}
</style>
