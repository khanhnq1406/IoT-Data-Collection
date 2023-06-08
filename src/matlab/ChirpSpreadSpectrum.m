fc = 1000; % T?n s? sóng mang
fs = 100000; % T?n s? l?y m?u
t = 0:1/fs:1; % Th?i gian m?u
carrier_signal = sin(2*pi*fc*t); % Tín hi?u sóng mang
f_start = 100;
f_end = 2000;
T = 1;
css_signal = calculateChirp(f_start, f_end, T, fs);

% Hi?n th? tín hi?u sóng mang
subplot(3,1,1)
plot(t, carrier_signal)
title('Tin hieu song mang')
xlabel('Thoi gian')
ylabel('Bien do')

% Hi?n th? tín hi?u CSS ban ??u
subplot(3,1,2)
plot(t, css_signal)
title('Tin hieu CSS')
xlabel('Thoi gian')
ylabel('Bien do')