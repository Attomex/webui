<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\VulnerabilityBase;

class ParseVulnerabilities extends Command
{
    protected $signature = 'parse:vulnerabilities';
    protected $description = 'Парсинг данных с сайта каждые 6 часов';

    public function handle()
    {
        $client = new Client(['verify' => false]); // Игнорируем проверку сертификатов
        $url = 'https://bdu.fstec.ru/site/scanoval'; // URL целевой страницы

        try {
            $response = $client->get($url);
            $html = $response->getBody()->getContents();

            $crawler = new Crawler($html);

            // Извлекаем дату последнего обновления
            $date = $crawler->filter('.portlet-content span.badge')->eq(2)->text();
            // Преобразование даты из формата "дд.мм.гггг" в "гггг-мм-дд"
            $date = \DateTime::createFromFormat('d.m.Y', $date)->format('Y-m-d');
            // Извлекаем ссылку на файл
            $link = $crawler->filter('a.btn.btn-info')->attr('href');

            // Преобразуем относительную ссылку в абсолютную
            $base_url = 'https://bdu.fstec.ru';
            $absolute_link = $base_url . $link;

            // Сохраняем данные в базе
            VulnerabilityBase::create([
                'date' => $date,
                'link' => $absolute_link,
            ]);

            $this->info("Данные успешно сохранены: дата $date, ссылка $absolute_link");
        } catch (\Exception $e) {
            $this->error('Ошибка парсинга: ' . $e->getMessage());
        }
    }
}
