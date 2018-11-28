const form = document.getElementById('vote-form');

//Form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=os]:checked').value;
    //const choice = $('input:radio[name="os"]:checked').val();
    const data = { os: choice };

    fetch('http://localhost:3000/poll', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    e.preventDefault();
});

fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        //count vote points
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
            ), {}
        );

        // Set initial Data Points
        if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
            voteCounts.Windows = 0;
            voteCounts.MacOS = 0;
            voteCounts.Linux = 0;
            voteCounts.Others = 0;
        }

        let dataPoint = [
            { label: 'Windows', y: voteCounts.Windows },
            { label: 'MacOS', y: voteCounts.MacOS },
            { label: 'Linux', y: voteCounts.Linux },
            { label: 'Others', y: voteCounts.Others },
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: { text: `Total Votes: ${totalVotes}` },
                data: [{
                    type: 'column',
                    dataPoints: dataPoint
                }]
            });

            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('ea76542dce65a13db788', {
                cluster: 'ap2',
                forceTLS: true
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function(data) {
                dataPoint = dataPoint.map(x => {
                    if (x.label == data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }

                });

                chart.render();
            });
        }
    });