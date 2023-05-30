const colors = {
    1: '#007bff',
    2: '#00cc00',
    3: '#ff4500',
    4: '#8a2be2',
    5: '#ffcc00',
    6: '#EAE3E3',
    reverse: function() {
        return Object.fromEntries(Object.entries(this).map(a => a.reverse()));
    },
    size: function() {
        return Object.keys(this).length -2;
    }
};

const feedbackColors={
    0: {label: 'correct', color:'#368b3d'},
    1: {label:'incorrect', color: '#FF0015'},
    2: {label: 'unknow', color:'#d8d8d857'},
    reverse: function() {
        return Object.fromEntries(Object.entries(this).map(a => a.reverse()));
    },
    size: function() {
        return Object.keys(this).length -2;
    }
};

const mastermindApiUrl = 'http://127.0.0.1:5000/';

export { colors, feedbackColors, mastermindApiUrl };