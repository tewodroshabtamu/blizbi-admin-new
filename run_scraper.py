import asyncio
from scripts.scrapers.classic.touofficial import TouOfficialScraper

async def main():
    scraper = TouOfficialScraper("https://www.touofficial.com", "15ef54ff-d350-44a1-8b9c-488307be786f")
    await scraper.run()

if __name__ == "__main__":
    asyncio.run(main()) 